import { useRef, useState, useCallback } from 'react';
import { Alert, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSignupMutation } from '../../../features/auth/authApi';
import React from 'react';
type Country = {
  name: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { name: 'India', code: '+91' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  // { name: 'Germany', code: '+49' },
  // { name: 'France', code: '+33' },
  // { name: 'Canada', code: '+1' },
  // { name: 'Australia', code: '+61' },
];

export const useSignupLogic = () => {
  const navigation = useNavigation<any>();
  const [signup, { isLoading }] = useSignupMutation();
  const navigatedForward = React.useRef(false);
  /* ================= STATE ================= */
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);

  /* ================= VALIDATION ================= */
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = /^\d{8,15}$/.test(phone);

  const isFormValid =
    fullName.trim().length > 2 &&
    isEmailValid &&
    isPhoneValid &&
    country.length > 0;

  /* ================= COUNTRY SELECT ================= */
  const handleSelectCountry = (selectedCountry: string) => {
    const found = COUNTRIES.find(c => c.name === selectedCountry);

    setCountry(selectedCountry);
    setCountryCode(found?.code || '+91');
    setPhone('');
    setModalVisible(false);

    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  /* ================= SUBMIT ================= */
  const handleSignup = async () => {
    if (!isFormValid || isLoading) return;

    try {
      const response = await signup({
        full_name: fullName.trim(),
        email: email.trim(),
        country_code: countryCode,
        phone,
        country,
      }).unwrap();

      const { success, exists, message, data } = response;

      // 🔴 USER ALREADY EXISTS → STOP HERE
      if (!success && exists) {
        Alert.alert(
          'Account Already Exists',
          message || 'This user is already registered. Please login.',
        );

        // ❌ DO NOT navigate to Terms
        // Optional: navigate to Login / OTP
        // navigation.navigate('Login');

        return;
      }

      // 🟢 NEW USER → Go to Terms & Privacy
      if (success && !exists) {
        navigation.navigate('TermCondition', {
          userId: data.user_id,
          phone,
          country,
        });

        return;
      }

      Alert.alert('Error', message || 'Unexpected response');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.message || err?.message || 'Something went wrong',
      );
    }
  };

  /* ================= CLEAR ON FOCUS ================= */
  useFocusEffect(
    useCallback(() => {
      if (navigatedForward.current) {
        setFullName('');
        setEmail('');
        setPhone('');
        setCountry('');
        setCountryCode('+91');
        setModalVisible(false);

        // reset flag
        navigatedForward.current = false;
      }
    }, []),
  );

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    country,
    countryCode,
    phone,
    setPhone,
    modalVisible,
    setModalVisible,
    phoneInputRef,

    countries: COUNTRIES.map(c => c.name),
    handleSelectCountry,

    isFormValid,
    isLoading,

    handleSignup,
  };
};
