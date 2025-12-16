import React, { useState, useRef } from 'react';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useSignupLogic } from './useSignupLogic';
import Loader from '../../../components/ui/Loader/Loader';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  View,
  StatusBar,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
export default function SignupScreen() {
  const {
    country,
    countryCode,
    phone,
    modalVisible,
    phoneInputRef,
    countries,
    setPhone,
    setModalVisible,
    handleSelectCountry,
    handleLogin,
    isLoading,
    setEmail,
    fullName,
    setFullName,
    email,
  } = useSignupLogic();
  const navigation = useNavigation();
  return (
    <View style={styles.maincontainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.imgcontainer}>
        <ImageBackground
          resizeMode="contain"
          style={styles.img}
          source={require('../../../../assets/image/women.png')}
        >
          <View
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <Image
              resizeMode="cover"
              style={styles.img}
              source={require('../../../../assets/image/blur.png')}
            />
          </View>
        </ImageBackground>
      </View>

      <SafeAreaProvider>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SafeAreaView
              edges={['top', 'left', 'right']}
              style={styles.safeArea}
            >
              <Loader visible={isLoading} color="blue" />

              <View style={styles.innercontainer}>
                <View style={styles.inputcontainer}>
                  <AppInput
                    keyboardType="default"
                    label={
                      <Text style={styles.labeltxt}>
                        Full Name{' '}
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      </Text>
                    }
                    placeholder="e.g. Saroha sans"
                    value={fullName}
                    onChangeText={setFullName}
                  />

                  <AppInput
                    keyboardType="email-address"
                    label={
                      <Text style={styles.labeltxt}>
                        Email ID{' '}
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      </Text>
                    }
                    placeholder="e.g. sarohasans@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                  />

                  {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.prefix}>
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                      source={require('../../../../assets/image/arrow-down.png')}
                    />
                  </View>
                </View> */}
                  <View pointerEvents="none">
                    <AppInput
                      label={
                        <Text style={{ ...styles.labeltxt }}>
                          Country
                          <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                        </Text>
                      }
                      value={country}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.prefix2}>
                      <Text style={styles.codetxt}>{countryCode}</Text>
                    </View>

                    <View style={{ width: '100%' }}>
                      <AppInput
                        label={
                          <Text style={{ ...styles.labeltxt }}>
                            Phone Number{' '}
                            <Text style={{ color: 'red', fontSize: 18 }}>
                              *
                            </Text>
                          </Text>
                        }
                        value={phone}
                        // autofocus={true}
                        onChangeText={setPhone}
                        inputStyle={styles.prefix2style}
                        keyboardType="phone-pad"
                        ref={phoneInputRef}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    activeOpacity={0.8}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => setModalVisible(true), 100);
                    }}
                  ></TouchableOpacity>
                </View>
                <AppButton title="Save And Continue" onPress={handleLogin} />
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
      <Text style={styles.bottomtxt}>
        Already have an account?
        <Text
          onPress={() => navigation.navigate('Login')}
          style={{ color: '#FF04D7', fontFamily: 'Quicksand-Bold' }}
        >
          {' '}
          Sign In
        </Text>
      </Text>
    </View>
  );
}
