import { View, Text, StatusBar, StyleSheet, Image } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export default function Splashscreen() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.imgcontainer}>
          <Image
            source={require('../../../assets/image/logo.png')}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imgcontainer: {
    width: responsiveScreenWidth(40),
    height: responsiveScreenHeight(40),
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
