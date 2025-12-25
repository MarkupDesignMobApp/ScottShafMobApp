import {
  View,
  Text,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { Data } from './data';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { useNavigation } from '@react-navigation/native';
import { useGetUserProfileQuery } from '../../../features/auth/authApi';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const { data, isLoading, refetch } = useGetUserProfileQuery();

  const user = data?.data?.user;

  const handleLogout = async () => {
    await removeTokenFromKeychain();
  };

  /* ------------------ LOADER ------------------ */
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle={'dark-content'} />

      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="My Account"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      {/* ================= PROFILE HEADER ================= */}
      <View style={styles.heading}>
        <View style={styles.imgcontainer}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={
              user?.profile?.profile_image
                ? { uri: user.profile.profile_image }
                : require('../../../../assets/image/women1.png')
            }
          />
        </View>

        <View style={{ paddingLeft: responsiveScreenWidth(4), flex: 1 }}>
          <Text style={styles.nametxt}>
            {user?.full_name ?? ''}
          </Text>

          <Text style={styles.nameheadtxt}>
            {user?.email ?? ''}
          </Text>

          {user?.created_at && (
            <Text style={[styles.nameheadtxt, styles.datetxt]}>
              Since {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => navigation.navigate('ProfileEdit')}
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

      {/* ================= MENU LIST ================= */}
      <View style={styles.listmaincontainer}>
        {Data.map(item => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (item.navigate === 'Privacy' || item.navigate === 'Notification') {
                navigation.getParent()?.navigate(item.navigate);
              } else {
                navigation.navigate('Profile', { screen: item.navigate });
              }
            }}
            
            
            style={styles.listcontainer}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.imgcontainer3}>
                <Image
                  tintColor={'#000'}
                  resizeMode="contain"
                  source={item.icon}
                  style={styles.img}
                />
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <View style={styles.imgcontainer3}>
              <Image
                tintColor={'#000'}
                resizeMode="contain"
                source={require('../../../../assets/image/next1.png')}
                style={styles.img}
              />
            </View>
          </Pressable>
        ))}
      </View>

      {/* ================= FOOTER ================= */}
      <View style={styles.bottomcontainer}>
        <View style={styles.termcontainer}>
          <Text style={styles.term}>Terms of Service</Text>
          <View style={styles.circleview} />
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
