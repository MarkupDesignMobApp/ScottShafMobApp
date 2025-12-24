import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  Modal,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { Switch } from 'react-native-paper';
import { styles as Homestyle } from '../../auth/Login/styles';
export default function CreateListScreen({ navigation }) {
  const [categories, setCategories] = useState([
    { name: 'Apple', code: 'apple' },
    { name: 'Banana', code: 'banana' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const selectedLabel = selected
    ? categories.find(c => c.code === selected)?.name ?? ''
    : '';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar hidden={false} barStyle="dark-content" />
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Create List"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={styles.container}>
        {/* LIST TITLE */}
        {/* <TouchableOpacity
          style={{ width: '100%' }}
          activeOpacity={0.8}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => setModalVisible(true), 150);
          }}
        >
          <View pointerEvents="none">
            <AppInput
                placeholder="e.g. Top 5 coffee shops in NYC"
              label={
                <Text style={Homestyle.labeltxt}>
                  Country <Text style={{ color: 'red' }}>*</Text>
                </Text>
              }
              // value={country}
            />
          </View>
        </TouchableOpacity> */}

        <AppInput
          placeholder="e.g. Top 5 coffee shops in NYC"
          label={
            <Text style={{ ...Homestyle.labeltxt }}>
              List Title
              <Text style={{ color: 'red', fontSize: 16 }}>*</Text>
            </Text>
          }
        />
        {/* <View style={[styles.fieldWrapper]}>
                    <Text style={styles.floatingLabel}>List Title</Text>
                    <TextInput
                        placeholder="e.g. Top 5 coffee shops in NYC"
                        placeholderTextColor="#B5B5B5"
                        style={styles.input}
                    />
                </View> */}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={Homestyle.prefix}>
            <Image
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              source={require('../../../../assets/image/arrow-down.png')}
            />
          </View>

          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                placeholder="Select Category"
                label={
                  <Text style={Homestyle.labeltxt}>
                    Category <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                //  value={country}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={styles.prefix}>
            <Image
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              source={require('../../../../assets/image/arrow-down.png')}
            />
          </View>

          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setModalVisible(true), 100);
            }}
          >
            <AppInput
              placeholder="Select Category"
              label={
                <Text style={{ ...styles.labeltxt }}>
                  Category
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
              value={selectedLabel}
              editable={false}
            />
          </TouchableOpacity>
        </View> */}

        {/* GROUP TOGGLE */}
        <View style={styles.targetcontainer}>
          <View style={styles.switchcontainer}>
            <Text style={styles.switchtxt}>Make it a group list?</Text>
            <Switch
              color="#FF04D7"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>

          <Text style={styles.privacytxt2}>
            Let friends collaborate & add their own picks to your list.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center',paddingTop:responsiveScreenHeight(2) }}>
          <View style={Homestyle.prefix}>
            <Image
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              source={require('../../../../assets/image/arrow-down.png')}
            />
          </View>

          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                placeholder="Select the top from list"
                label={
                  <Text style={Homestyle.labeltxt}>
                    List Type <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                //  value={country}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* BUTTON */}

        <AppButton title="Create Group List" onPress={() => {}} />

        {/* INVITED */}
        <View style={styles.invitedBox}>
          <Text style={styles.invitedTitle}>Invited (2)</Text>
          <View style={styles.invitedRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Sarah M.</Text>
              <Text style={styles.close}>✕</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Alex K.</Text>
              <Text style={styles.close}>✕</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Simple modal selector for categories */}
      {modalVisible && (
        <Modal transparent animationType="fade" visible={modalVisible}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView>
                {categories.map(item => (
                  <TouchableOpacity
                    key={item.code}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelected(item.code);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: responsiveScreenWidth(4) },

  fieldWrapper: {
    marginTop: responsiveScreenHeight(2),
    zIndex: 10,
  },
  prefix: {
    position: 'absolute',
    paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: '#AEAEAE',
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4),
  },
  labeltxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
  },

  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#0180FE',
    borderRadius: responsiveScreenWidth(4),
    marginTop: responsiveScreenHeight(1),
    backgroundColor: '#EFFCFF',
  },
  switchcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.9),
    letterSpacing: 0.5,
    color: '#00C4FA',
  },
  privacytxt2: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.68),
    paddingTop: responsiveScreenHeight(2),
    color: '#535353',
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

  input: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#E4E6EB',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },

  invitedBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,

    marginTop: responsiveScreenHeight(3),
    borderColor: '#0180FE',
  },
  invitedTitle: {
    fontSize: responsiveScreenFontSize(1.75),
    color: '#1DA1F2',
    marginBottom: responsiveHeight(1.5),
  },

  invitedRow: { flexDirection: 'row' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFE9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: { marginRight: 6 },
  close: { color: '#999' },
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
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  modalItemText: { fontSize: 14 },
});
