import React, { useState, useRef } from 'react';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useLoginLogic } from './useLoginLogic';
import Loader from '../../../components/ui/Loader/Loader';
import { Image, View, StatusBar, ImageBackground, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Social from '../../../components/ui/SocialButton/Button';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
export default function LoginScreen() {
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
  } = useLoginLogic();





  return (
    <View style={styles.maincontainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.imgcontainer}>
        <ImageBackground
          resizeMode="contain"
          style={styles.img}
          source={require('../../../../assets/image/loginbanner.png')}
        >
          <View
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <Image
              resizeMode="cover"
              style={styles.img}
              source={require('../../../../assets/image/blur.png')}
            />
          </View>
          <View style={styles.headcontainer}>
            <Text style={{ ...styles.heading }}>Welcome Back!</Text>
            <Text style={{ ...styles.heading2 }}>
              We'll send you a verification code
            </Text>
          </View>
        </ImageBackground>
      </View>

      <SafeAreaProvider>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 20} // adjust if you have header
        >

          <ScrollView
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
             <Loader visible={isLoading} color="blue" />

              <View style={styles.innercontainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.prefix}>
                    <Image style={{ width: '100%', height: '100%' }} resizeMode='contain' source={require("../../../../assets/image/arrow-down.png")} />
                  </View>
                  <View style={{ width: '100%' }}>
                    <AppInput
                      label={
                        <Text style={{ ...styles.labeltxt }}>
                          Country<Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                        </Text>
                      }
                      value={country}

                      editable={false}

                      onPress={() => setModalVisible(true)}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.prefix2}>
                    <Text>{countryCode}</Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <AppInput

                      label={<Text style={{ ...styles.labeltxt }}>Phone Number <Text style={{ color: 'red', fontSize: 18 }}>*</Text></Text>}
                      value={phone}
                      autofocus={true}
                      onChangeText={setPhone}
                      inputStyle={styles.prefix2style}
                      keyboardType="phone-pad"
                      ref={phoneInputRef}

                    />
                  </View>
                </View>

                <AppButton
                  title="Sent OTP"
                  onPress={handleLogin}
                />
                <View
                  style={{
                    ...styles.bottomtxt,
                  }}
                >
                  <View style={styles.linestyle}></View>
                  <Text style={styles.bottomtxt2}>or sign in with</Text>
                  <View style={styles.linestyle}></View>
                </View>

                <View
                  style={{
                    ...styles.bottomtxt3,
                  }}
                >
                  <Social
                    title="Google"
                    source={require('../../../../assets/image/google.png')}
                  />

                  <Social
                    title="Apple"
                    source={require('../../../../assets/image/apple.png')}
                  />
                </View>
              </View>

            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
