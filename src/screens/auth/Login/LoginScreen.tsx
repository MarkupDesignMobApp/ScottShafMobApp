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
import { useLoginLogic } from './useLoginLogic';

import { AppButton } from '../../../components/ui/AppButton/AppButton';
import Loader from '../../../components/ui/Loader/Loader';
import Social from '../../../components/ui/SocialButton/Button';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';

import { navigateDeepLink } from '../../../navigation/navigateDeepLink';
import { consumePendingDeepLink } from '../../../utils/pendingDeepLink';

type LoginScreenProps = {
  onLoginSuccess?: () => void;
};

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

  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleLoginPress = async () => {
    const success = await handleLogin();

    if (success) {
      onLoginSuccess?.();

      const url = consumePendingDeepLink();

      if (url) {
        navigateDeepLink(url);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Banner */}
      <View style={styles.bannerSection}>
        <ImageBackground
          source={require('../../../../assets/image/loginbanner.png')}
          style={styles.bannerImage}
        >
          <View style={styles.overlay} />

          <View style={styles.bannerContent}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>
          </View>
        </ImageBackground>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
        >
          <ScrollView
            scrollEnabled={keyboardOpen}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
          >
            <Loader visible={isLoading} color="#2C3E50" />

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={styles.formCard}>
                {/* FORM CONTENT */}
                <View>
                  <View style={styles.headerSection}>
                    <Text style={styles.headerTitle}>Sign In</Text>
                    <Text style={styles.headerSubtitle}>
                      Enter your credentials
                    </Text>
                  </View>

                  {/* Country */}
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

                  {/* Phone */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone Number</Text>

                    <View
                      style={[
                        styles.phoneWrapper,
                        phoneFocused && styles.phoneWrapperFocused,
                      ]}
                    >
                      <View style={styles.countryCodeBox}>
                        <Text style={styles.countryCodeText}>
                          {countryCode}
                        </Text>
                      </View>

                      <TextInput
                        ref={phoneInputRef}
                        style={styles.phoneInput}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#95A5A6"
                        keyboardType="phone-pad"
                        underlineColorAndroid="transparent"
                        selectionColor="#2C3E50"
                        onFocus={() => setPhoneFocused(true)}
                        onBlur={() => setPhoneFocused(false)}
                      />
                    </View>
                  </View>

                  {/* Button */}
                  <View style={styles.buttonWrapper}>
                    <AppButton
                      title="Continue"
                      onPress={handleLoginPress}
                      disabled={!isFormComplete || isLoading}
                      style={[
                        styles.submitButton,
                        (!isFormComplete || isLoading) &&
                          styles.submitButtonDisabled,
                      ]}
                      textStyle={styles.submitButtonText}
                    />
                  </View>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Social */}
                  <View style={styles.socialSection}>
                    <Social
                      title="Google"
                      source={require('../../../../assets/image/google.png')}
                      containerStyle={styles.socialButton}
                      textStyle={styles.socialButtonText}
                    />

                    <Social
                      title="Apple"
                      source={require('../../../../assets/image/apple.png')}
                      containerStyle={styles.socialButton}
                      textStyle={styles.socialButtonText}
                    />
                  </View>

                  {/* Signup */}
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>
                      Don’t have an account?{' '}
                      <Text
                        style={styles.signupLink}
                        onPress={() => navigation.navigate('Signup')}
                      >
                        Sign up
                      </Text>
                    </Text>
                  </View>
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
