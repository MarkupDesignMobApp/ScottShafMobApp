import { View, Text, StatusBar } from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import Recommend from './Recommend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
export default function Recommend_Screen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: responsiveScreenWidth(4),
      }}
    >
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'#fff'}
      />
      <AppHeader title="Recommend For You" />
      <Recommend />
    </View>
  );
}
