import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useLoginMutation } from '../../../features/auth/authApi';
import { saveTokenToKeychain } from '../../../app/keychain';
import { useNavigation } from '@react-navigation/native';

type Country = {
  name: string;
  code: string;
};
const navigation = useNavigation;
const COUNTRIES: Country[] = [
  { name: 'India', code: '+91' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'Canada', code: '+1' },
  { name: 'Australia', code: '+61' },
  { name: 'Japan', code: '+81' },
  { name: 'China', code: '+86' },
  { name: 'Brazil', code: '+55' },
];

export const useLoginLogic = () => {
  /* ================= API ================= */
  const [login, { isLoading, isError }] = useLoginMutation();
  const navigation = useNavigation();
  /* ================= STATE ================= */
  const [country, setCountry] = useState('India');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);

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
    navigation.navigate('Otp');
    // try {
    //   NavigationActions.goToRegister();
    //   // const res = await login({
    //   //   email: country, // or phone, based on backend
    //   //   password: phone,
    //   // }).unwrap();

    //   // await saveTokenToKeychain(res.access_token);
    // } catch (error) {
    //   console.log('Login failed:', error);
    // }
  };

  return {
    /* UI state */
    country,
    countryCode,
    phone,
    modalVisible,
    phoneInputRef,
    countries: COUNTRIES.map(c => c.name),

    /* setters */
    setPhone,
    setModalVisible,

    /* actions */
    handleSelectCountry,
    handleLogin,

    /* api flags */
    isLoading,
    isError,
  };
};
