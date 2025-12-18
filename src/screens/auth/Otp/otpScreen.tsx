import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { saveTokenToKeychain } from '../../../app/keychain';
import { useOtpLogic } from './useOtpLogic';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
export default function OtpScreen() {
  const {
    otp,
    timer,
    isResendEnabled,
    inputsRef,
    isOtpComplete,
    handleOtpChange,
    handleKeyPress,
    handleResendOtp,
    submitOtp,
  } = useOtpLogic();

  const onVerify = async () => {
    const otpCode = submitOtp();
    if (!otpCode) return;
    try {
      // const res = await login({
      //   email: country, // or phone, based on backend
      //   password: phone,
      // }).unwrap();

      await saveTokenToKeychain("123456");
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* HEADER */}
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

      {/* BODY */}
      <SafeAreaProvider>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ?responsiveScreenHeight(30) : 0}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.headcontainer}>
            <Text style={styles.heading}>OTP Verification</Text>
            <Text style={styles.heading2}>
              Enter the code from the SMS we sent to{' '}
              <Text style={{ color: '#0180FE', fontFamily: 'Quicksand-Bold' }}>
                +91 976 058 6144
              </Text>
            </Text>
          </View>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.innercontainer}>
                {/* OTP INPUTS */}
                <View style={styles.otpcontainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      ref={ref => (inputsRef.current[index] = ref!)}
                      onChangeText={text => handleOtpChange(text, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                {/* RESEND */}
                <View style={styles.resendcontainer}>
                  <View style={styles.icon}>
                    <Image
                      style={styles.img}
                      resizeMode="contain"
                      source={require('../../../../assets/image/reload.png')}
                    />
                  </View>

                  <TouchableOpacity
                    disabled={!isResendEnabled}
                    onPress={handleResendOtp}
                  >
                    <Text
                      style={[
                        styles.resendtxt,
                        { color: isResendEnabled ? '#0180FE' : '#999' },
                      ]}
                    >
                      {isResendEnabled
                        ? 'Resend Code'
                        : `Resend Code in ${timer}s`}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* VERIFY */}
                <AppButton
                  title="Verify"
                  disabled={!isOtpComplete}
                  onPress={onVerify}
                />
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </View>
  );
}
