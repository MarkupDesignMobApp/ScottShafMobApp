import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Modal,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  Platform,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Switch } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import { useFocusEffect } from '@react-navigation/native';
import {
  useCreateListMutation,
  useGetInviteUsersQuery,
  useGetCatalogCategoriesQuery,
} from '../../../features/auth/authApi';

export default function CreateListScreen({ navigation }) {
  /* ================= REFS ================= */
  const titleInputRef = useRef<TextInput>(null);
  const subCategoryInputRef = useRef<TextInput>(null);
  const listSizeInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  /* ================= STATES ================= */
  const [title, setTitle] = useState('');
  const [listSize, setListSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);
  const [subCategory, setSubCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    { id: number; full_name: string }[]
  >([]);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
    Number(listSize) > 0 &&
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
      setSubCategory('');
      setModalVisible(false);
      setIsGroup(false);
      setSelectedUsers([]);
      setFocusedInput(null);
    }, []),
  );

  const handleCreateList = async () => {
    Keyboard.dismiss();
    try {
      if (!selectedCategory) return;

      const payload: any = {
        title: title.trim(),
        category_id: selectedCategory.id,
        list_size: Number(listSize),
        is_group: isGroup,
      };

      if (subCategory && subCategory.trim().length > 0) {
        payload.sub_category_id = subCategory.trim();
      }

      if (isGroup) {
        payload.user_ids = selectedUsers.map(u => u.id);
      }

      const res = await createList(payload).unwrap();

      navigation.navigate('Browsecat', {
        listId: res.data.id,
        categoryId: selectedCategory.id,
        isGroup,
        userIds: isGroup ? selectedUsers.map(u => u.id) : [],
        listSize: Number(listSize),
        title: title.trim(),
        subCategory: subCategory.trim(),
      });
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to create list');
    }
  };

  const getInputStyle = (inputName: string) => [
    styles.input,
    focusedInput === inputName && styles.inputFocused,
  ];

  const focusInput = (inputName: string, ref: React.RefObject<TextInput>) => {
    setFocusedInput(inputName);
    setTimeout(() => {
      ref.current?.focus();
    }, 100);
  };

  // Render form header (all inputs before the invite section)
  const renderFormHeader = () => (
    <>
      <Text style={styles.sectionTitle}>📋 List Information</Text>

      {/* LIST TITLE */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          List Title <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => focusInput('title', titleInputRef)}
          style={getInputStyle('title')}
        >
          <Text style={styles.inputEmoji}>📝</Text>
          <TextInput
            ref={titleInputRef}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Top 5 coffee shops in NYC"
            placeholderTextColor="#A0A0A0"
            style={styles.textInput}
            onFocus={() => setFocusedInput('title')}
            onBlur={() => setFocusedInput(null)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (Platform.OS === 'ios') {
                subCategoryInputRef.current?.focus();
              }
            }}
            blurOnSubmit={false}
          />
        </TouchableOpacity>
      </View>

      {/* CATEGORY */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Category <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => setModalVisible(true), 100);
          }}
          style={[
            styles.input,
            focusedInput === 'category' && styles.inputFocused,
          ]}
        >
          <Text style={styles.inputEmoji}>📁</Text>
          <Text
            style={[
              styles.textInput,
              !selectedCategory && styles.placeholderText,
            ]}
          >
            {selectedCategory?.name || 'Select a category'}
          </Text>
          <Text style={[styles.inputEmoji, styles.arrowEmoji]}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* SUB CATEGORY */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Sub Category (Optional)</Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => focusInput('subCategory', subCategoryInputRef)}
          style={getInputStyle('subCategory')}
        >
          <Text style={styles.inputEmoji}>🏷️</Text>
          <TextInput
            ref={subCategoryInputRef}
            value={subCategory}
            onChangeText={setSubCategory}
            placeholder="Type sub category"
            placeholderTextColor="#A0A0A0"
            style={styles.textInput}
            onFocus={() => setFocusedInput('subCategory')}
            onBlur={() => setFocusedInput(null)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (Platform.OS === 'ios') {
                listSizeInputRef.current?.focus();
              }
            }}
            blurOnSubmit={false}
          />
        </TouchableOpacity>
      </View>

      {/* LIST SIZE */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          List Size <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => focusInput('listSize', listSizeInputRef)}
          style={getInputStyle('listSize')}
        >
          <Text style={styles.inputEmoji}>🔢</Text>
          <TextInput
            ref={listSizeInputRef}
            value={listSize}
            onChangeText={setListSize}
            keyboardType="numeric"
            placeholder="e.g. 5"
            placeholderTextColor="#A0A0A0"
            style={styles.textInput}
            onFocus={() => setFocusedInput('listSize')}
            onBlur={() => setFocusedInput(null)}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
        </TouchableOpacity>
        {listSize && !isNaN(Number(listSize)) && Number(listSize) > 0 && (
          <Text style={styles.hintText}>
            Your list will contain {listSize} items
          </Text>
        )}
      </View>

      {/* GROUP SWITCH CARD */}
      <View style={styles.groupCard}>
        <View style={styles.groupCardHeader}>
          <View style={styles.groupCardTitleContainer}>
            <Text style={styles.groupEmoji}>👥</Text>
            <Text style={styles.groupCardTitle}>Group List</Text>
          </View>
          <Switch
            color="#2C3E50"
            value={isGroup}
            onValueChange={setIsGroup}
          />
        </View>
        <Text style={styles.groupCardDescription}>
          Let friends collaborate & add their own picks to your list
        </Text>
      </View>
    </>
  );

  // Render footer with create button
  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.createButton,
          (!isFormValid || isLoading) && styles.createButtonDisabled,
        ]}
        onPress={handleCreateList}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.createButtonText}>Create List</Text>
            <Text style={styles.createButtonEmoji}>{'>'}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={{ width: '100%', height: '100%', tintColor: '#FFFFFF' }}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Create New List</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraHeight={Platform.OS === 'ios' ? 50 : 120}
            extraScrollHeight={Platform.OS === 'ios' ? 30 : 60}
            keyboardOpeningTime={250}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Render form header */}
            {renderFormHeader()}

            {/* INVITE USERS - Only shown when isGroup is true */}
            {isGroup && (
              <View style={styles.inviteSection}>
                <View style={styles.inviteHeader}>
                  <Text style={styles.inviteTitle}>
                    👥 Invite Collaborators
                  </Text>
                  <Text style={styles.inviteCount}>
                    {selectedUsers.length} selected
                  </Text>
                </View>

                {inviteUsersLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2C3E50" />
                  </View>
                ) : inviteUsers.length === 0 ? (
                  <View style={styles.emptyUsersContainer}>
                    <Text style={styles.emptyUsersEmoji}>👤❌</Text>
                    <Text style={styles.emptyUsersText}>
                      No users to invite
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={inviteUsers}
                    keyExtractor={item => item.id.toString()}
                    nestedScrollEnabled
                    scrollEnabled={false}
                    contentContainerStyle={styles.chipContainer}
                    renderItem={({ item }) => {
                      const selected = selectedUsers.some(
                        u => u.id === item.id,
                      );

                      return (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => toggleUser(item)}
                          style={[
                            styles.userChip,
                            selected && styles.userChipSelected,
                          ]}
                        >
                          <View
                            style={[
                              styles.userChipAvatar,
                              selected && styles.userChipAvatarSelected,
                            ]}
                          >
                            <Text style={styles.userChipAvatarText}>
                              {item.full_name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.userChipText,
                              selected && styles.userChipTextSelected,
                            ]}
                          >
                            {item.full_name}
                          </Text>
                          {selected ? (
                            <Text
                              style={[
                                styles.chipEmoji,
                                styles.chipEmojiSelected,
                              ]}
                            >
                              ✓
                            </Text>
                          ) : (
                            <Text style={styles.chipEmoji}>+</Text>
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
              </View>
            )}

            {/* Render footer with create button */}
            {renderFooter()}
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>

      {/* CATEGORY MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📁 Select Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseEmoji}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {categoryLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#2C3E50"
                  style={styles.modalLoader}
                />
              ) : categories.length === 0 ? (
                <View style={styles.emptyCategories}>
                  <Text style={styles.emptyCategoriesEmoji}>📂❌</Text>
                  <Text style={styles.emptyCategoriesText}>
                    No categories found
                  </Text>
                </View>
              ) : (
                categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.modalItem,
                      selectedCategory?.id === cat.id &&
                      styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedCategory?.id === cat.id &&
                        styles.modalItemTextSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                    {selectedCategory?.id === cat.id && (
                      <Text style={styles.modalCheckEmoji}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2.5),
    paddingTop: responsiveScreenHeight(4)
  },
  headerLeft: {
    width: 22,
    height: 22,
  },
  headerRight: {
    width: responsiveScreenWidth(8),
  },
  headerTitle: {
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
  },
  scrollContainer: {
    padding: responsiveScreenWidth(5),
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: responsiveScreenHeight(2),
    fontFamily: 'Quicksand-Bold',
  },
  inputWrapper: {
    marginBottom: responsiveScreenHeight(2.5),
  },
  label: {
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: responsiveScreenHeight(0.5),
    fontFamily: 'Quicksand-Regular',
  },
  requiredStar: {
    color: '#E53E3E',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: responsiveScreenWidth(3),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsiveScreenWidth(3),
    height: responsiveScreenHeight(6.5),
    width: '100%',
  },
  inputFocused: {
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputEmoji: {
    fontSize: responsiveScreenFontSize(2),
    marginRight: responsiveScreenWidth(2),
  },
  arrowEmoji: {
    marginLeft: 'auto',
    marginRight: 0,
    color: '#A0A0A0',
    fontSize: responsiveScreenFontSize(1.6),
  },
  textInput: {
    flex: 1,
    fontSize: responsiveScreenFontSize(1.6),
    color: '#1A202C',
    padding: 0,
    fontFamily: 'Quicksand-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  placeholderText: {
    color: '#A0A0A0',
    flex: 1,
    fontSize: responsiveScreenFontSize(1.6),
  },
  hintText: {
    fontSize: responsiveScreenFontSize(1.3),
    color: '#2C3E50',
    marginTop: responsiveScreenHeight(0.5),
    fontFamily: 'Quicksand-Regular',
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveScreenWidth(4),
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveScreenHeight(0.5),
  },
  groupCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupEmoji: {
    fontSize: responsiveScreenFontSize(2.2),
    marginRight: responsiveScreenWidth(2),
  },
  groupCardTitle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'Quicksand-Bold',
  },
  groupCardDescription: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#718096',
    fontFamily: 'Quicksand-Regular',
  },
  inviteSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveScreenWidth(4),
    padding: responsiveScreenWidth(4),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: responsiveScreenHeight(2),
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1.5),
  },
  inviteTitle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'Quicksand-Bold',
  },
  inviteCount: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Regular',
  },
  loadingContainer: {
    padding: responsiveScreenHeight(2),
    alignItems: 'center',
  },
  emptyUsersContainer: {
    alignItems: 'center',
    padding: responsiveScreenHeight(2),
  },
  emptyUsersEmoji: {
    fontSize: responsiveScreenFontSize(3),
    marginBottom: responsiveScreenHeight(1),
  },
  emptyUsersText: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: responsiveScreenWidth(5),
    paddingHorizontal: responsiveScreenWidth(2.5),
    paddingVertical: responsiveScreenHeight(0.5),
    marginRight: responsiveScreenWidth(1.5),
    marginBottom: responsiveScreenHeight(0.8),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userChipSelected: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },
  userChipAvatar: {
    width: responsiveScreenWidth(6),
    height: responsiveScreenWidth(6),
    borderRadius: responsiveScreenWidth(3),
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveScreenWidth(1.5),
  },
  userChipAvatarSelected: {
    backgroundColor: '#FFFFFF',
  },
  userChipAvatarText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.4),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  userChipText: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#4A5568',
    marginRight: responsiveScreenWidth(1.5),
    fontFamily: 'Quicksand-Regular',
  },
  userChipTextSelected: {
    color: '#FFFFFF',
  },
  chipEmoji: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#2C3E50',
  },
  chipEmojiSelected: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(10),
  },
  createButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: '600',
    marginRight: responsiveScreenWidth(2),
    fontFamily: 'Quicksand-Bold',
  },
  createButtonEmoji: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveScreenWidth(4),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveScreenWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'Quicksand-Bold',
  },
  modalCloseEmoji: {
    fontSize: responsiveScreenFontSize(2),
    color: '#718096',
  },
  modalLoader: {
    padding: responsiveScreenHeight(3),
  },
  emptyCategories: {
    padding: responsiveScreenHeight(3),
    alignItems: 'center',
  },
  emptyCategoriesEmoji: {
    fontSize: responsiveScreenFontSize(3),
    marginBottom: responsiveScreenHeight(1),
  },
  emptyCategoriesText: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsiveScreenWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemSelected: {
    backgroundColor: '#F7FAFC',
  },
  modalItemText: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#4A5568',
    fontFamily: 'Quicksand-Regular',
  },
  modalItemTextSelected: {
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  modalCheckEmoji: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#2C3E50',
  },
});