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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { useSignupLogic } from './useSignupLogic';

import { AppButton } from '../../../components/ui/AppButton/AppButton';
import Loader from '../../../components/ui/Loader/Loader';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
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

  const navigation = useNavigation();
  const keyboardOpen = useKeyboardOpen();

  const [phoneFocused, setPhoneFocused] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* BANNER */}
      <View style={styles.bannerSection}>
        <ImageBackground
          source={require('../../../../assets/image/women.png')}
          style={styles.bannerImage}
        >
          <View style={styles.overlay} />

          <View style={styles.bannerContent}>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Fill in your details to get started
            </Text>
          </View>
        </ImageBackground>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            scrollEnabled={keyboardOpen}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Loader visible={isLoading} color="#2C3E50" />

            <View style={styles.formCard}>
              {/* HEADER */}
              <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Sign Up</Text>
                <Text style={styles.headerSubtitle}>
                  Enter your information
                </Text>
              </View>

              {/* FULL NAME */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#95A5A6"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* EMAIL */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#95A5A6"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* COUNTRY */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Country</Text>

                <TouchableOpacity
                  style={styles.countryField}
                  onPress={() => {
                    Keyboard.dismiss();
                    setModalVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.countryText,
                      !country && styles.placeholderText,
                    ]}
                  >
                    {country || 'Select your country'}
                  </Text>

                  <Image
                    source={require('../../../../assets/image/arrow-down.png')}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* PHONE */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone Number</Text>

                <View
                  style={[
                    styles.phoneWrapper,
                    phoneFocused && styles.phoneWrapperFocused,
                  ]}
                >
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                  </View>

                  <TextInput
                    ref={phoneInputRef}
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    placeholderTextColor="#95A5A6"
                    keyboardType="phone-pad"
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                  />
                </View>
              </View>

              {/* BUTTON */}
              <View style={styles.buttonWrapper}>
                <AppButton
                  title="Save & Continue"
                  onPress={handleSignup}
                  disabled={!isFormValid || isLoading}
                  style={[
                    styles.submitButton,
                    (!isFormValid || isLoading) && styles.submitButtonDisabled,
                  ]}
                  textStyle={styles.submitButtonText}
                />
              </View>

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                  <Text
                    style={styles.signupLink}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>

              {/* TERMS */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By continuing you agree to our{' '}
                  <Text style={styles.link}>Terms of Service</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
