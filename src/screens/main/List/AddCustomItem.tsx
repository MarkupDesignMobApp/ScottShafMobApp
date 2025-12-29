import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  Alert,
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
import { useAddListItemMutation } from '../../../features/auth/authApi';

export default function AddCustomItem({ navigation, route }) {
  // 🔑 listId passed from previous screen
  // const { listId } = route.params;

  // form state
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');

  // API
  const [addListItem, { isLoading }] = useAddListItemMutation();

  // submit handler (ONE hit only)
  const handleAddItem = async () => {
    if (!itemName.trim()) return;

    try {
      const res = await addListItem({
        listId:9,
        custom_item_name: itemName.trim(),
        custom_text: description.trim(),
      }).unwrap();

      // ✅ success message
      Alert.alert('Success', res.message || 'Item added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate("Reorder"),
        },
      ]);
    } catch (error: any) {
      // ❌ error message
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to add item. Please try again.',
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Loader color='blue' visible={isLoading} />

      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor="#000"
      />

      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Add Custom Item"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <View style={styles.container}>
        {/* ITEM NAME */}
        <AppInput
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
          label={
            <Text style={styles.labeltxt}>
              List Title
              <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
            </Text>
          }
        />

        {/* DESCRIPTION */}
        <View
          style={[
            styles.fieldWrapper,
            { paddingVertical: responsiveScreenHeight(0) },
          ]}
        >
          <Text style={styles.labeltxt}>Description (Optional)</Text>
          <TextInput
            multiline
            placeholder="Add a short description"
            placeholderTextColor="#B5B5B5"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
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
                This item will be marked as custom and will only appear in your
                list.
              </Text>
            </View>
          </View>
        </View>

        {/* BUTTON */}
        <AppButton
          title={isLoading ? 'Adding...' : 'Add Item'}
          onPress={handleAddItem}
          disabled={isLoading || !itemName.trim()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveScreenWidth(4),
  },

  fieldWrapper: {
    marginTop: responsiveScreenHeight(1),
  },

  floatingLabel: {
    position: 'absolute',
    top: -9,
    left: 18,
    backgroundColor: '#FFFFFF', // must be solid
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#8A8A8A',
    zIndex: 20, // ⭐ label ABOVE everything
  },
  descriptionLabel: {
    paddingHorizontal: 18,
    marginBottom: 6,
    backgroundColor: '#FFFFFF', // must be solid
    fontSize: 12,
    color: '#8A8A8A',
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
    // alignItems: 'center',
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
    // left: responsiveScreenWidth(7),
    color: '#000000',
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
    // height: 52,
    // borderRadius: 26,
    // borderWidth: 1.2,
    // borderColor: '#E4E6EB',
    // paddingHorizontal: 18,
    // fontSize: 14,
    // color: '#1A1A1A',
    // backgroundColor: '#FFFFFF',
    // zIndex: 1,
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
