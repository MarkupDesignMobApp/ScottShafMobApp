import {
  View,
  Text,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Data } from './data';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { useNavigation } from '@react-navigation/native';
import { useGetUserProfileQuery } from '../../../features/auth/authApi';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const { data, isLoading } = useGetUserProfileQuery();
  const user = data?.data?.user;

  const handleLogout = async () => {
    await removeTokenFromKeychain();
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerTitle}>My Account</Text>

        <Pressable onPress={handleLogout}>
          <Image
            source={require('../../../../assets/image/logout.png')}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <Image
            style={styles.profileImage}
            resizeMode="cover"
            source={
              user?.profile?.profile_image
                ? { uri: user.profile.profile_image }
                : require('../../../../assets/image/nophoto.jpg')
            }
          />

          <Text style={styles.name}>{user?.full_name ?? ''}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>

          {user?.created_at && (
            <Text style={styles.memberSince}>
              Member since{' '}
              {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          )}

          <Pressable
            onPress={() => navigation.navigate('ProfileEdit', { Edit: 'edit' })}
            style={styles.editButton}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* SETTINGS */}
        <View style={styles.settingsCard}>
          {Data.map(item => (
            <Pressable
              key={item.id}
              style={styles.settingItem}
              onPress={() => {
                if (
                  item.navigate === 'Privacy' ||
                  item.navigate === 'Notification'
                ) {
                  navigation.getParent()?.navigate(item.navigate);
                } else {
                  navigation.navigate('Profile', {
                    screen: item.navigate,
                  });
                }
              }}
            >
              <View style={styles.settingLeft}>
                <Image source={item.icon} style={styles.settingIcon} />
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>

              <Image
                source={require('../../../../assets/image/next1.png')}
                style={styles.arrow}
              />
            </Pressable>
          ))}
        </View>

        {/* SAVE BUTTON */}
        <Pressable
          style={styles.saveButton}
          onPress={() => navigation.navigate('ProfileEdit', { Edit: 'edit' })}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
