import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ImageBackground,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';

import { styles } from './styles';
import { useSignupLogic } from './useSignupLogic';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import Loader from '../../../components/ui/Loader/Loader';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';

/* 🔹 Keyboard hook */
const useKeyboardOpen = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setOpen(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return open;
};

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
    handleSignup,
    isLoading,
    setEmail,
    fullName,
    setFullName,
    email,
    isFormValid,
  } = useSignupLogic();
  const scrollRef = React.useRef(null);

  const navigation = useNavigation();
  const keyboardOpen = useKeyboardOpen();
  useEffect(() => {
    if (!keyboardOpen) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }
  }, [keyboardOpen]);

  return (
    <View style={styles.maincontainer}>
      <Loader color='#0180FE' visible={isLoading} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* ---------- FIXED BANNER ---------- */}
      <View style={styles.imgcontainer}>
        <ImageBackground
          source={require('../../../../assets/image/women.png')}
          resizeMode="cover"
          style={styles.banner}
        >
          {/* Blur overlay */}
          <Image
            source={require('../../../../assets/image/blur.png')}
            resizeMode="cover"
            style={styles.img}
          />

          {/* <View style={styles.headcontainer}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.heading2}>
              Fill the details to continue
            </Text>
          </View> */}
        </ImageBackground>
      </View>

      {/* ---------- SCROLLABLE CONTENT ---------- */}
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            scrollEnabled={keyboardOpen}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardOpen ? responsiveScreenHeight(18) : 0,
            }}
          >
            {/* <Loader visible={isLoading} color="blue" /> */}

            <View style={styles.innercontainer}>
              {/* Full Name */}
              <AppInput
                label={
                  <Text style={styles.labeltxt}>
                    Full Name <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                placeholder="e.g. Saroha Sans"
                value={fullName}
                onChangeText={setFullName}
                inputStyle={{ color: '#000' }}
              />

              {/* Email */}
              <AppInput

                keyboardType="email-address"
                label={
                  <Text style={styles.labeltxt}>
                    Email ID <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                placeholder="e.g. abc@gmail.com"
                value={email}
                onChangeText={setEmail}
              />

              {/* Country */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => setModalVisible(true), 150);
                }}
              >
                <View style={{ position: 'relative' }}>
                  <View pointerEvents="none">
                    <AppInput
                    placeholder='Select Country'
                      label={
                        <Text style={styles.labeltxt}>
                          Country <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                      }
                      value={country}
                    />
                  </View>

                  <Image
                    source={require('../../../../assets/image/arrow-down.png')}
                    style={styles.countryArrow}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              {/* Phone */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.prefix2}>
                  <Text style={styles.codetxt}>{countryCode}</Text>
                </View>

                <View style={{ width: '100%' }}>
                  <AppInput
                    label={
                      <Text style={styles.labeltxt}>
                        Phone Number <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    }
                    value={phone}
                    onChangeText={setPhone}
                    inputStyle={styles.prefix2style}
                    keyboardType="phone-pad"
                    ref={phoneInputRef}
                  />
                </View>
              </View>

              {/* Button */}
              <AppButton
                title={isLoading ? 'Please wait...' : 'Save And Continue'}
                onPress={handleSignup}
                disabled={!isFormValid || isLoading}
              />

              {/* Bottom */}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ---------- COUNTRY MODAL ---------- */}
      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
