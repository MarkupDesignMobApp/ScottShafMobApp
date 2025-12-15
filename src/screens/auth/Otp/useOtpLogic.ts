import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

const OTP_LENGTH = 6;
const RESEND_TIME = 10;

export function useOtpLogic() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const inputsRef = useRef<TextInput[]>([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) {
      setIsResendEnabled(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP HANDLERS ================= */
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text[0] || '';
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  /* ================= ACTIONS ================= */
  const submitOtp = () => {
    if (!isOtpComplete) return;
    const otpCode = otp.join('');
    return otpCode; 
  };

  const handleResendOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
    setTimer(RESEND_TIME);
    setIsResendEnabled(false);
  };

  return {
    otp,
    timer,
    isResendEnabled,
    inputsRef,
    isOtpComplete,
    handleOtpChange,
    handleKeyPress,
    handleResendOtp,
    submitOtp,
  };
}
