import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import Loader from '../../../components/ui/Loader/Loader';
import {
  useAddListItemMutation,
  useAddCatalogItemsMutation,
} from '../../../features/auth/authApi';

export default function AddCustomItem({ navigation, route }) {
  const { listId } = route.params;

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');

  const [addListItem, { isLoading }] = useAddCatalogItemsMutation();

  const handleAddItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Required', 'Item name is required');
      return;
    }

    try {
      const res = await addListItem({
        listId,
        custom_item_name: itemName,
        custom_text: description,
      }).unwrap();

      if (res?.success) {
        navigation.navigate('Reorder', {
          listId: listId,
        });
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.message || err?.error || 'Something went wrong',
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Loader color="#2C3E50" visible={isLoading} />

      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Custom Header with Theme */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.headerIcon}
            tintColor="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Custom Item</Text>
        <View style={styles.headerRight} />
      </View>

      {/* KEYBOARD HANDLING */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            {/* ITEM NAME */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                Item name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity activeOpacity={1} style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter item name"
                  placeholderTextColor="#A0A0A0"
                  value={itemName}
                  onChangeText={setItemName}
                  style={styles.textInput}
                />
              </TouchableOpacity>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.inputContainer, styles.textAreaContainer]}
              >
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder="Add a short description"
                  placeholderTextColor="#A0A0A0"
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.textInput, styles.textArea]}
                  textAlignVertical="top"
                />
              </TouchableOpacity>
            </View>

            {/* INFO BOX */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../../assets/image/info.png')}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Custom Item</Text>
                  <Text style={styles.infoDescription}>
                    This item will be marked as custom and will only appear in
                    your list.
                  </Text>
                </View>
              </View>
            </View>

            {/* BUTTON */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.addButton,
                  (isLoading || !itemName.trim()) && styles.addButtonDisabled,
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  handleAddItem();
                }}
                disabled={isLoading || !itemName.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.addButtonText}>Add Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
  },
  headerLeft: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  headerIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  headerRight: {
    width: responsiveScreenHeight(3),
  },
  container: {
    flexGrow: 1,
    padding: responsiveScreenWidth(5),
  },
  inputWrapper: {
    marginBottom: responsiveScreenHeight(2.5),
  },
  label: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.8),
    color: '#4A5568',
    marginBottom: responsiveScreenHeight(0.8),
  },
  requiredStar: {
    color: '#E53E3E',
    fontSize: responsiveScreenFontSize(2),
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: responsiveScreenWidth(3),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsiveScreenWidth(3),
    minHeight: responsiveScreenHeight(6.5),
    justifyContent: 'center',
  },
  textAreaContainer: {
    minHeight: responsiveScreenHeight(15),
    paddingVertical: responsiveScreenHeight(1),
  },
  textInput: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#1A202C',
    fontFamily: 'Quicksand-Regular',
    padding: 0,
    includeFontPadding: false,
  },
  textArea: {
    height: responsiveScreenHeight(14),
    textAlignVertical: 'top',
  },
  infoCard: {
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(4),
    marginVertical: responsiveScreenHeight(3),
    backgroundColor: '#F0F4F8',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    padding: responsiveScreenWidth(4),
  },
  iconContainer: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenHeight(4),
    marginRight: responsiveScreenWidth(3),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: '#2C3E50',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2),
    color: '#2C3E50',
    marginBottom: responsiveScreenHeight(0.5),
  },
  infoDescription: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.6),
    color: '#718096',
    lineHeight: responsiveScreenHeight(2.2),
  },
  buttonContainer: {
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(4),
  },
  addButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
});
