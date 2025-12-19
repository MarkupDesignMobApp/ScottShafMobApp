import { View, Text, StatusBar, Image, Pressable } from 'react-native';
import React from 'react';

import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { Data } from './data';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { useNavigation } from '@react-navigation/native';
export default function ProfileScreen() {
  const navigation = useNavigation({ navigation });
  const handleLogout = async () => {
    await removeTokenFromKeychain();
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle={'dark-content'} />
      <AppHeader
        onLeftPress={() => navigation.goBack()}
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
        <Pressable
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.edit}
        >
          <Text style={styles.edittxt}>Edit</Text>
          <View style={styles.imgcontainer2}>
            <Image
              resizeMode="contain"
              source={require('../../../../assets/image/edit.png')}
              style={styles.img}
            />
          </View>
        </Pressable>
      </View>
      <View style={styles.listmaincontainer}>
        {Data.map((item, index) => (
          <Pressable
            onPress={() => navigation.getParent()?.navigate(item.navigate)}
            style={styles.listcontainer}
            key={item.id}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.imgcontainer3}>
                <Image
                  tintColor={'#000000'}
                  resizeMode="contain"
                  source={item.icon}
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
          </Pressable>
        ))}
      </View>
      <View style={styles.bottomcontainer}>
        <View style={styles.termcontainer}>
          <Text style={styles.term}>Terms of Service</Text>
          <View style={styles.circleview}></View>
          <Text style={styles.term}>Privacy Policy</Text>
        </View>
        <AppButton
          onPress={handleLogout}
          image={require('../../../../assets/image/logout.png')}
          title="LogOut"
        />
      </View>
    </View>
  );
}
