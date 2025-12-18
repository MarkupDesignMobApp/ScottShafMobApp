import { View, Text, StatusBar, Image } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { Data } from './data';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        title="My Account"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={styles.heading}>
        <View style={styles.imgcontainer}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require('../../../../assets/image/women1.png')}
          />
        </View>
        <View style={{ paddingLeft: responsiveScreenWidth(4) }}>
          <Text style={styles.nametxt}>Sarah Johnson</Text>
          <Text style={styles.nameheadtxt}>sarah.johnson@gmail.com</Text>
          <Text style={[styles.nameheadtxt, styles.datetxt]}>
            Since Jan 2025
          </Text>
        </View>
        <View style={styles.edit}>
          <Text style={styles.edittxt}>Edit</Text>
          <View style={styles.imgcontainer2}>
            <Image
              resizeMode="contain"
              source={require('../../../../assets/image/edit.png')}
              style={styles.img}
            />
          </View>
        </View>
      </View>
      <View style={styles.listmaincontainer}>
        {Data.map((item, index) => (
          <View style={styles.listcontainer} key={item.id}>
            <View style={{flexDirection:'row',alignItems:"center"}}>
              <View style={styles.imgcontainer3}>
              <Image
              tintColor={'#000000'}
                resizeMode="contain"
                source={require('../../../../assets/image/user.png')}
                style={styles.img}
              />
            </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.imgcontainer3}>
              <Image
              tintColor={'#000000'}
                resizeMode="contain"
                source={require('../../../../assets/image/next1.png')}
                style={styles.img}
              />
            </View>
          </View>
        ))}
      </View>
      <View style={{paddingHorizontal:responsiveScreenWidth(4)}}>
      <AppButton image={require('../../../../assets/image/home.png')} title="LogOut"/>
      </View>
    </View>
  );
}
