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
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { styles } from './styles';
import { useOtpLogic } from './useOtpLogic';

import { AppButton } from '../../../components/ui/AppButton/AppButton';

import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Loader from '../../../components/ui/Loader/Loader';

/* 🔹 Keyboard hook */
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


  const keyboardOpen = useKeyboardOpen();
  ;
  return (
    <View style={styles.maincontainer}>
      <Loader color='#0180FE' visible={isVerifying} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* ---------- Banner (NON-SCROLLABLE) ---------- */}

      <View style={styles.imgcontainer}>
        <ImageBackground
          source={require('../../../../assets/image/loginbanner.png')}
          resizeMode="cover"
          style={styles.banner}
        >
          {/* Blur overlay */}
          <Image
            source={require('../../../../assets/image/blur.png')}
            resizeMode="cover"
            style={{ ...styles.img }}
          />



        </ImageBackground>

      </View>
      <View style={styles.headcontainer}>
        <Text style={styles.heading}>OTP Verification</Text>
        <Text style={styles.heading2}>
          Enter the code from the SMS we sent to<Text style={{ color: '#0180FE',fontWeight:"500" }}>{phone}</Text>
        </Text>
        <Text />
      </View>


      {/* ---------- Scrollable Content ---------- */}
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            scrollEnabled={keyboardOpen}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="never"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardOpen ? responsiveScreenHeight(12) : responsiveScreenHeight(4),


            }}
          >
            {/* <Loader visible={isLoading} color="blue" /> */}

            <View style={styles.innercontainer}>

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



              {/* OTP INPUTS */}

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
                      { color: isResendEnabled ? '#0180FE' : '#000' },
                    ]}
                  >
                    {isResendEnabled
                      ? 'Resend Code'
                      : `Resend Code in ${timer}s`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Verify */}
              <AppButton
                title={isVerifying ? 'Verifying...' : 'Verify'}
                disabled={!isOtpComplete || isVerifying}
                onPress={() => submitOtp()}
              />

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>


    </View>
  );
}
