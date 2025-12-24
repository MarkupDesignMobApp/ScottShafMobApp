import { useEffect, useRef, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import {
  useVerifyOtpMutation,
  useRequestOtpMutation,
} from '../../../features/auth/authApi';
import { setCredentials } from '../../../features/auth/authSlice';
import { saveTokenToKeychain } from '../../../app/keychain';

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

export function useOtpLogic(phone: string, country: string) {
  type OnboardingParams = {
    TermCondition: { userId: number };
    Interests: { userId: number };
    CompleteProfile: { userId: number };
  };

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  /* ================= API ================= */
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestOtpMutation();

  /* ================= STATE ================= */
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const inputsRef = useRef<TextInput[]>([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) {
      setIsResendEnabled(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP INPUT ================= */
  const handleOtpChange = (text: string, index: number) => {
    const value = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(d => d !== '');

  /* ================= VERIFY OTP ================= */
  const submitOtp = async () => {
    if (!isOtpComplete || isVerifying) return;

    try {
      const response = await verifyOtp({
        phone,
        country,
        otp: otp.join(''),
      }).unwrap();

      // ❌ Invalid OTP
      if (!response.success) {
        Alert.alert('Verification Failed', response.message);
        return;
      }

      // 🟡 Onboarding incomplete
      if ('data' in response) {
        const { is_consent, is_interest, is_profile } = response.data;
        const userId = response.user_id;

        if (!is_consent) {
          navigation.replace('TermCondition', { userId });
          return;
        }

        if (!is_interest) {
          navigation.replace('Intrestpick', { userId });
          return;
        }

        if (!is_profile) {
          navigation.replace('About', { userId });
          return;
        }
      }

      // 🟢 Login successful (ALL COMPLETE)
      if ('token' in response) {
        await saveTokenToKeychain(response.token);

        dispatch(
          setCredentials({
            token: response.token,
            user: response.user,
          }),
        );

        // RootNavigator handles navigation
        return;
      }

      Alert.alert('Error', 'Unexpected server response');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  /* ================= RESEND / REQUEST OTP ================= */
  const handleResendOtp = async () => {
    if (!isResendEnabled || isResending) return;

    try {
      const response = await requestOtp({ phone, country }).unwrap();

      // Reset OTP inputs & timer
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(RESEND_TIME);
      setIsResendEnabled(false);
      inputsRef.current[0]?.focus();

      // 🔹 Show the OTP coming from API
      if (response.success && response.otp) {
        Alert.alert('OTP Sent', `Your OTP is: ${response.otp}`);
      } else {
        Alert.alert('OTP Sent', response.message || 'OTP has been sent');
      }
    } catch (err) {
      const error = err as FetchBaseQueryError;
      const message =
        'data' in error && error.data && (error.data as any).message
          ? (error.data as any).message
          : 'Failed to resend OTP';

      Alert.alert('Error', message);
    }
  };

  return {
    otp,
    timer,
    isResendEnabled,
    inputsRef,

    isOtpComplete,
    isVerifying,
    isResending,

    handleOtpChange,
    handleKeyPress,
    submitOtp,
    handleResendOtp,
  };
}
