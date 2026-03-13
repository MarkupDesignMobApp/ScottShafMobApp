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
  TextInput
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useOtpLogic } from './useOtpLogic';
import Loader from '../../../components/ui/Loader/Loader';

export default function OtpScreen({ route }) {

  const { phone, country } = route.params;

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
    isVerifying
  } = useOtpLogic(phone, country);

  return (

    <View style={styles.container}>

      <Loader visible={isVerifying} color="#2C3E50" />

      <StatusBar
        barStyle="light-content"
        backgroundColor="#2C3E50"
      />

      {/* Banner */}

      <ImageBackground
        source={require('../../../../assets/image/loginbanner.png')}
        style={styles.banner}
      >

        <View style={styles.bannerOverlay} />

        <Text style={styles.bannerTitle}>
          OTP Verification
        </Text>

      </ImageBackground>

      <SafeAreaView style={{ flex: 1 }}>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >

            <View style={styles.innerContainer}>

              <Text style={styles.subtitle}>
                Enter the code sent to
              </Text>

              <Text style={styles.phoneText}>
                {phone}
              </Text>

              {/* OTP INPUT */}

              <View style={styles.otpContainer}>

                {otp.map((digit, index) => (

                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    ref={ref => (inputsRef.current[index] = ref)}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                  />

                ))}

              </View>

              {/* RESEND */}

              <View style={styles.resendContainer}>

                <TouchableOpacity
                  disabled={!isResendEnabled}
                  onPress={handleResendOtp}
                >

                  <Text
                    style={[
                      styles.resendText,
                      { color: isResendEnabled ? "#2C3E50" : "#BDC3C7" }
                    ]}
                  >

                    {isResendEnabled
                      ? "Resend Code"
                      : `Resend in ${timer}s`
                    }

                  </Text>

                </TouchableOpacity>

              </View>

              {/* VERIFY BUTTON */}

              <TouchableOpacity
                disabled={!isOtpComplete || isVerifying}
                onPress={submitOtp}
                style={[
                  styles.verifyButton,
                  (!isOtpComplete || isVerifying) && styles.disabledButton
                ]}
              >

                <Text style={styles.verifyText}>
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Text>

              </TouchableOpacity>

            </View>

          </ScrollView>

        </KeyboardAvoidingView>

      </SafeAreaView>

    </View>

  );
}