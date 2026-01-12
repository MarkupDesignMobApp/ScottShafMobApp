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
} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
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
      await addListItem({
        listId,
        custom_item_name: itemName,
        custom_text: description,
      }).unwrap();

      Alert.alert('Success', 'Item added successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Reorder', {
              listId: listId,
            }),
        },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.message || err?.error || 'Something went wrong',
      );
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Loader color="blue" visible={isLoading} />

      <StatusBar barStyle="dark-content" />

      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Add Custom Item"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      {/* ✅ KEYBOARD HANDLING */}
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
            <AppInput
              placeholder="Enter item name"
              value={itemName}
              onChangeText={setItemName}
              label={
                <Text style={styles.labeltxt}>
                  Item name
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />

            {/* DESCRIPTION */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.labeltxt}>Description (Optional)</Text>
              <TextInput
                multiline
                placeholder="Add a short description"
                placeholderTextColor="#B5B5B5"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                textAlignVertical="top" // ✅ ANDROID FIX
              />
            </View>

            {/* INFO BOX */}
            <View style={styles.targetcontainer}>
              <View style={styles.switchcontainer}>
                <View style={styles.iconcontainer}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../../assets/image/info.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <View style={{ paddingLeft: responsiveScreenWidth(3) }}>
                  <Text style={styles.switchtxt}>Custom Item</Text>
                  <Text style={styles.privacytxt2}>
                    This item will be marked as custom and will only appear in
                    your list.
                  </Text>
                </View>
              </View>
            </View>

            {/* BUTTON */}
            <AppButton
              title={isLoading ? 'Adding...' : 'Add Item'}
              disabled={isLoading || !itemName.trim()}
              onPress={() => {
                Keyboard.dismiss(); // ✅ DISMISS KEYBOARD
                handleAddItem();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: responsiveScreenWidth(4),
  },

  fieldWrapper: {
    marginTop: responsiveScreenHeight(1),
  },

  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#FF04D7',
    borderRadius: responsiveScreenWidth(4),
    marginVertical: responsiveScreenHeight(4),
    backgroundColor: '#FFFBFE',
  },

  switchcontainer: {
    flexDirection: 'row',
  },

  switchtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.9),
    letterSpacing: 0.5,
    color: '#FF04D7',
  },

  privacytxt2: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.68),
    paddingTop: responsiveScreenHeight(0.5),
    color: '#000',
    width: responsiveScreenWidth(75),
  },

  input: {
    marginTop: responsiveScreenHeight(2),
    borderWidth: 1,
    height: responsiveScreenHeight(18),
    borderColor: 'lightgrey',
    borderRadius: responsiveScreenWidth(2),
    padding: responsiveScreenHeight(1.75),
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2),
    textAlignVertical: 'top', // ✅ REQUIRED FOR ANDROID
  },

  labeltxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2),
  },

  iconcontainer: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenHeight(5),
    marginTop: -responsiveScreenHeight(1),
  },
});
