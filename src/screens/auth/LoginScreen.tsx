import React, { useState } from 'react';
import { AppButton } from '../../components/ui/AppButton/AppButton';
import { AppInput } from '../../components/ui/AppInput/AppInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useLoginLogic } from './useLoginLogic';
import Loader from '../../components/ui/Loader/Loader';
import { Image, View, StatusBar, ImageBackground, Text } from 'react-native';
import Social from '../../components/ui/SocialButton/Button';
export default function LoginScreen() {
  const { handleLogin, isLoading } = useLoginLogic();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          source={require('../../../assets/image/loginbanner.png')}
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
              source={require('../../../assets/image/blur.png')}
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
      {/* <View style={styles.imgcontainer}>
        <Image
          resizeMode="contain"
          style={styles.img}
          source={require('../../../assets/image/blur.png')}
        />
      </View> */}
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          {isLoading && <Loader color="blue" />}

          <View style={styles.innercontainer}>
            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />

            <AppInput
              label="Password"
              placeholder="Enter password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />

            <AppButton
              title="Sent OTP"
              onPress={() => handleLogin(email, password)}
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
                source={require('../../../assets/image/google.png')}
              />

              <Social
                title="Apple"
                source={require('../../../assets/image/apple.png')}
              />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}
