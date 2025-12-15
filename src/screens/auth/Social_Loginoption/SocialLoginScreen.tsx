import { View, Text, Image, StatusBar, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Button from '../../../components/ui/SocialButton/Button';
import { OpenLinkInApp } from '../../../components/ui/Browser/browser';
export default function SocialLoginScreen() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.imgcontainer}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/logo.png')}
              />
            </View>
            <Text style={styles.headtxt1}>Welcome</Text>
            <Text style={styles.headtxt2}>
              Sign in to create and share your lists
            </Text>

            <Button
              source={require('../../../../assets/image/google.png')}
              title="Continue With Google"
              buttonStyle={styles.btn}
            />
            <Button
              source={require('../../../../assets/image/apple.png')}
              title="Continue With Apple"
              buttonStyle={styles.btn}
            />
            <Button
              source={require('../../../../assets/image/telephone.png')}
              title="Continue With Phone"
              buttonStyle={styles.btn}
            />

            <View
              style={{
                ...styles.bottomtxt,
              }}
            >
              <View style={styles.linestyle}></View>
              <Text style={styles.bottomtxt2}>or</Text>
              <View style={styles.linestyle}></View>
            </View>
            <Button
              source={require('../../../../assets/image/user.png')}
              title="Create new Account"
              buttonStyle={styles.btn}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 50,
              alignSelf: 'center',
            }}
          >
            <Text style={styles.mostbottomtxt}>
              By continuing, you agree to our
            </Text>
            <View style={styles.hyperlinktxtcontainer}>
              <Pressable onPress={() => OpenLinkInApp('https://www.wwe.com')}>
                <Text style={styles.hypertxt}>Terms of service</Text>
              </Pressable>
              <Pressable onPress={() => OpenLinkInApp('https://www.wwe.com')}>
                <Text style={styles.hypertxt}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
