import React from 'react';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { useLoginLogic } from './useLoginLogic';

import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import Loader from '../../../components/ui/Loader/Loader';
import Social from '../../../components/ui/SocialButton/Button';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';

export default function LoginScreen() {
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
  } = useLoginLogic();

  const navigation = useNavigation();

  /** ---------- SCROLL CONTENT ---------- */
  const Content = () => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <View style={styles.headcontainer}>
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.heading2}>
          We&apos;ll send you a verification code
        </Text>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <Loader visible={isLoading} color="blue" />

        <View style={styles.innercontainer}>
          {/* Country */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                setTimeout(() => setModalVisible(true), 150);
              }}
            >
              <View pointerEvents="none">
                <AppInput
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

            <View style={{ width: '100%', }}>
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

          <AppButton title="Send OTP" onPress={handleLogin} />

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
      </SafeAreaView>
    </ScrollView>
  );

  return (
    <View style={styles.maincontainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Banner */}
      <View style={styles.imgcontainer}>
        <ImageBackground
          resizeMode="contain"
          style={styles.img}
          source={require('../../../../assets/image/loginbanner.png')}
        >
          <Image
            resizeMode="cover"
            style={styles.img}
            source={require('../../../../assets/image/blur.png')}
          />

        </ImageBackground>
      </View>

      {/* Content */}
      <SafeAreaProvider>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <Content />
          </KeyboardAvoidingView>
        ) : (
          <Content />
        )}
      </SafeAreaProvider>

      {/* Country Picker */}
      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
