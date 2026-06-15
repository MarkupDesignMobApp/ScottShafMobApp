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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaProvider style={{ flex: 1 }}>
      <Loader color="#2C3E50" visible={isLoading} />
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Header Container (dark) */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image
              tintColor="#fff"
              resizeMode="contain"
              style={styles.backIcon}
              source={require('../../../../assets/image/left-icon.png')}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Custom Item</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      {/* Main Content (light background) */}
      <View style={styles.contentContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formContainer}>
              {/* Item Name */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Item name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter item name"
                    placeholderTextColor="#A0A0A0"
                    value={itemName}
                    onChangeText={setItemName}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Description (Optional)</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
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
                </View>
              </View>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Image
                      resizeMode="contain"
                      source={require('../../../../assets/image/info.png')}
                      style={styles.icon}
                      tintColor="#2C3E50"
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Absolute Footer (same as BrowseCatalogScreen) */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1.5),
  },
  backButton: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  backIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: responsiveScreenHeight(3),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(12), // extra space for absolute footer
  },
  formContainer: {
    flexGrow: 1,
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
    borderWidth: 1,
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
    borderWidth: 1,
    borderColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(4),
    marginVertical: responsiveScreenHeight(3),
    backgroundColor: '#F0F4F8',
  },
  infoRow: {
    flexDirection: 'row',
    padding: responsiveScreenWidth(4),
  },
  iconContainer: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenHeight(4),
    marginRight: responsiveScreenWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  addButton: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#2C3E50',
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
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
    fontFamily: 'Quicksand-Bold',
  },
});
