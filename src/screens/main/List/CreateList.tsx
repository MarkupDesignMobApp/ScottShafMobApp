import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  Modal,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Switch } from 'react-native-paper';
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { styles as Homestyle } from '../../auth/Login/styles';
import { useFocusEffect } from '@react-navigation/native';
import {
  useCreateListMutation,
  useGetInviteUsersQuery,
  useGetCatalogCategoriesQuery,
} from '../../../features/auth/authApi';

export default function CreateListScreen({ navigation }) {
  /* ================= STATES ================= */
  const [title, setTitle] = useState('');
  const [listSize, setListSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    { id: number; full_name: string }[]
  >([]);

  /* ================= API ================= */
  const [createList, { isLoading }] = useCreateListMutation();
  const { data: inviteUsersResponse, isLoading: inviteUsersLoading } =
    useGetInviteUsersQuery(undefined, { skip: !isGroup });
  const inviteUsers = inviteUsersResponse?.data ?? [];

  const { data: categories = [], isLoading: categoryLoading } =
    useGetCatalogCategoriesQuery();

  /* ================= VALIDATION ================= */
  const isFormValid =
    title.trim().length > 0 &&
    !!selectedCategory &&
    listSize.trim().length > 0 &&
    !isNaN(Number(listSize)) &&
    (!isGroup || selectedUsers.length > 0);

  /* ================= HANDLERS ================= */
  const toggleUser = (user: { id: number; full_name: string }) => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user],
    );
  };

  useFocusEffect(
    useCallback(() => {
      setTitle('');
      setListSize('');
      setSelectedCategory(null);
      setModalVisible(false);
      setIsGroup(false);
      setSelectedUsers([]);
    }, []),
  );

  const handleCreateList = async () => {
    try {
      if (!selectedCategory) return;

      const payload: any = {
        title: title.trim(),
        category_id: selectedCategory.id,
        list_size: Number(listSize),
        is_group: isGroup,
      };

      if (isGroup) {
        payload.user_ids = selectedUsers.map(u => u.id);
      }

      const res = await createList(payload).unwrap();

      Alert.alert('Success', res?.message || 'List created successfully');

      navigation.navigate('Browsecat', {
        listId: res.data.id,
        categoryId: selectedCategory.id, // ✅ pass selected category id dynamically
        isGroup,
        userIds: isGroup ? selectedUsers.map(u => u.id) : [],
        listSize: Number(listSize),
        title: title.trim(),
      });
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to create list');
    }
  };

  /* ================= UI ================= */
  return (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <StatusBar barStyle="dark-content" />

    <AppHeader
      title="Create List"
      leftImage={require('../../../../assets/image/left-icon.png')}
      onLeftPress={() => navigation.goBack()}
    />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      {/* CONTENT */}
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        {/* LIST TITLE */}
        <AppInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Top 5 coffee shops in NYC"
          label={
            <Text style={Homestyle.labeltxt}>
              List Title <Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
        />

        {/* CATEGORY */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: responsiveScreenHeight(2),
          }}
        >
          <View style={styles.prefix}>
            <Image
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              source={require('../../../../assets/image/arrow-down.png')}
            />
          </View>
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                value={selectedCategory?.name ?? ''}
                placeholder="Select Category"
                label={
                  <Text style={Homestyle.labeltxt}>
                    Category <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* GROUP SWITCH */}
        <View style={styles.targetcontainer}>
          <View style={styles.switchcontainer}>
            <Text style={styles.switchtxt}>Make it a group list?</Text>
            <Switch
              color="#FF04D7"
              value={isGroup}
              onValueChange={setIsGroup}
            />
          </View>
          <Text style={styles.privacytxt2}>
            Let friends collaborate & add their own picks to your list.
          </Text>
        </View>

        {/* INVITE USERS */}
        {isGroup && (
          <View style={styles.invitedBox}>
            <Text style={styles.invitedTitle}>Invite Users</Text>
            {inviteUsersLoading ? (
              <Text>Loading users...</Text>
            ) : (
              <ScrollView contentContainerStyle={styles.chipContainer}>
                {inviteUsers.map(user => {
                  const selected = selectedUsers.some(u => u.id === user.id);
                  return (
                    <View
                      key={user.id}
                      style={[
                        styles.chip,
                        selected && { backgroundColor: '#E6F3FF' },
                      ]}
                    >
                      <Text style={{ marginRight: 6 }}>{user.full_name}</Text>
                      <TouchableOpacity onPress={() => toggleUser(user)}>
                        {selected ? (
                          <Image
                            source={require('../../../../assets/image/close.png')}
                            style={styles.closeIcon}
                          />
                        ) : (
                          <Text
                            style={{ color: '#0180FE', fontWeight: 'bold' }}
                          >
                            +
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* LIST SIZE */}
        <View style={{ marginTop: responsiveScreenHeight(2) }}>
          <AppInput
            value={listSize}
            onChangeText={setListSize}
            keyboardType="numeric"
            placeholder="e.g. 5"
            label={
              <Text style={Homestyle.labeltxt}>
                List Size <Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
          />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <AppButton
          title={isLoading ? 'Creating...' : 'Create List'}
          disabled={!isFormValid || isLoading}
          onPress={handleCreateList}
        />
      </View>
    </KeyboardAvoidingView>

    {/* CATEGORY MODAL */}
    {modalVisible && (
      <Modal transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setModalVisible(false);
                }}
              >
                <Text>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    )}
  </View>
);

}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: responsiveScreenWidth(4) },
  prefix: {
    position: 'absolute',
    right: responsiveScreenWidth(8),
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4),
  },
  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#0180FE',
    borderRadius: responsiveScreenWidth(4),
    marginTop: responsiveScreenHeight(2),
    backgroundColor: '#EFFCFF',
  },
  switchcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchtxt: { fontSize: responsiveScreenFontSize(1.9), color: '#00C4FA' },
  privacytxt2: {
    fontSize: responsiveScreenFontSize(1.6),
    paddingTop: responsiveScreenHeight(2),
    color: '#535353',
  },
  invitedBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginTop: responsiveScreenHeight(2),
    borderColor: '#0180FE',
    maxHeight: responsiveScreenHeight(25),
  },
  invitedTitle: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#1DA1F2',
    marginBottom: responsiveHeight(1.5),
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    borderColor: '#CFE9FF',
  },
  closeIcon: {
    width: responsiveHeight(2),
    height: responsiveHeight(2),
    resizeMode: 'contain',
  },
  footer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
