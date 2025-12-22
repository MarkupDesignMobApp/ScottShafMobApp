import { useRef, useState, useCallback } from 'react';
import { TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useRequestOtpMutation } from '../../../features/auth/authApi';

type Country = {
  name: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { name: 'India', code: '+91' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
];

export const useLoginLogic = () => {
  const navigation = useNavigation();
  const [requestOtp, { isLoading }] = useRequestOtpMutation();

  /* ================= STATE ================= */
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!country) {
      Alert.alert('Validation Error', 'Please select a country');
      return false;
    }

    if (!phone) {
      Alert.alert('Validation Error', 'Please enter phone number');
      return false;
    }

    if (!/^\d{8,15}$/.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  /* ================= HANDLERS ================= */
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

  const handleLogin = async () => {
    if (!validate()) return;

    const fullPhone = `${countryCode}${phone}`;

    try {
      const response = await requestOtp({
        phone: fullPhone,
        country,
      }).unwrap();

      if (response.success) {
        // 🔹 Show the OTP in an alert (for testing/debugging)
        if (response.otp) {
          Alert.alert('OTP Sent', `Your OTP is: ${response.otp}`);
        } else {
          Alert.alert('OTP Sent', response.message);
        }

        // ✅ Navigate to OTP screen
        navigation.navigate('Otp', {
          phone: fullPhone,
          country,
        });
      } else {
        // ❌ User not found → DO NOT navigate
        Alert.alert('User Not Found', response.message);
      }
    } catch (error: any) {
      // Only network / server errors
      Alert.alert('Error', error?.data?.message || 'Failed to send OTP');
    }
  };

  const isFormComplete = Boolean(country) && /^\d{8,15}$/.test(phone);

  useFocusEffect(
    useCallback(() => {
      setCountry('');
      setCountryCode('+91');
      setPhone('');
      setModalVisible(false);
    }, [])
  );

  return {
    country,
    countryCode,
    phone,
    modalVisible,
    phoneInputRef,
    countries: COUNTRIES.map(c => c.name),

    setPhone,
    setModalVisible,

    handleSelectCountry,
    handleLogin,
    isFormComplete,
    isLoading,
  };
};
