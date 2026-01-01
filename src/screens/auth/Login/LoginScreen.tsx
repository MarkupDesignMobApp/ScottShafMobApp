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

import { styles } from './styles';
import { useLoginLogic } from './useLoginLogic';

import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import Loader from '../../../components/ui/Loader/Loader';
import Social from '../../../components/ui/SocialButton/Button';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';

import { navigateDeepLink } from '../../../navigation/navigateDeepLink';
import { consumePendingDeepLink } from '../../../utils/pendingDeepLink'; // your utility file

type LoginScreenProps = {
  onLoginSuccess?: () => void;
};

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

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
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
    isFormComplete,
  } = useLoginLogic();

  const navigation = useNavigation();
  const keyboardOpen = useKeyboardOpen();

  // Handle OTP login button press
  const handleLoginPress = async () => {
    const success = await handleLogin(); // your existing login logic
    if (success) {
      // Call optional callback from RootNavigator
      onLoginSuccess?.();

      // Consume pending deep link
      const url = consumePendingDeepLink();
      if (url) {
        navigateDeepLink(url); // <-- navigate inside app, not open Safari
      } else {
        // Default navigation if no pending link
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    }
  };

  return (
    <View style={styles.maincontainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ---------- Banner (NON-SCROLLABLE) ---------- */}
      <View style={styles.imgcontainer}>
        <ImageBackground
          source={require('../../../../assets/image/loginbanner.png')}
          resizeMode="cover"
          style={styles.banner}
        >
          <Image
            source={require('../../../../assets/image/blur.png')}
            resizeMode="cover"
            style={{ ...styles.img }}
          />

          <View style={styles.headcontainer}>
            <Text style={styles.heading}>Welcome Back!</Text>
            <Text style={styles.heading2}>
              We&apos;ll send you a verification code
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* ---------- Scrollable Content ---------- */}
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            scrollEnabled={keyboardOpen}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="never"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardOpen ? responsiveScreenHeight(12) : 0,
            }}
          >
            <Loader visible={isLoading} color="blue" />

            <View style={styles.innercontainer}>
              {/* Country */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.prefix}>
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
                      placeholder="Select Country"
                      label={
                        <Text style={styles.labeltxt}>
                          Country <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                      }
                      value={country}
                    />
                  </View>
                </TouchableOpacity>
              </View>

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

              {/* Send OTP Button */}
              <AppButton
                title="Send OTP"
                onPress={handleLoginPress}
                disabled={!isFormComplete || isLoading}
              />

              {/* OR */}
              <View style={styles.bottomtxt}>
                <View style={styles.linestyle} />
                <Text style={styles.bottomtxt2}>or sign in with</Text>
                <View style={styles.linestyle} />
              </View>

              {/* Social */}
              <View style={styles.bottomtxt3}>
                <Social
                  title="Google"
                  source={require('../../../../assets/image/google.png')}
                />
                <Social
                  title="Apple"
                  source={require('../../../../assets/image/apple.png')}
                />
              </View>

              {/* Signup */}
              <Text style={styles.bottomtxt4}>
                Don&apos;t have an account?
                <Text
                  onPress={() => navigation.navigate('Signup')}
                  style={{ color: '#FF04D7', fontFamily: 'Quicksand-Bold' }}
                >
                  {' '}
                  Sign Up
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ---------- Country Picker ---------- */}
      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
