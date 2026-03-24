// ProfileScreen.tsx
import {
  View,
  Text,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { Data } from './data';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { useNavigation } from '@react-navigation/native';
import {
  useGetUserProfileQuery,
  useDeleteAccountMutation // ✅ Import the delete account hook
} from '../../../features/auth/authApi';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useGetUserProfileQuery();
  const [deleteAccount] = useDeleteAccountMutation(); // ✅ Initialize the mutation

  const user = data?.data?.user;

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await removeTokenFromKeychain();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleDeleteAccount = async () => {
    setDeleteModalVisible(false);
    setIsDeleting(true);

    try {
      // ✅ Call the delete account API
      const response = await deleteAccount().unwrap();

      console.log('Delete account response:', response);

      // Show success message
      Alert.alert(
        'Account Deletion Request',
        response?.message || 'Your account deletion request has been submitted successfully. We will process your request and notify you via email once completed.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Clear token and navigate to login
              await removeTokenFromKeychain();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error('Delete account error:', error);

      // Show error message
      Alert.alert(
        'Deletion Failed',
        error?.data?.message || error?.message || 'Unable to process your request. Please try again later or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSettingPress = (item: any) => {
    if (item.action === 'DELETE_ACCOUNT') {
      setDeleteModalVisible(true);
    } else if (item.navigate === 'Privacy' || item.navigate === 'Notification') {
      navigation.getParent()?.navigate(item.navigate);
    } else {
      navigation.navigate('Profile', {
        screen: item.navigate,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  return (
    <>
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

          <Pressable onPress={() => setLogoutModalVisible(true)}>
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
            <View style={styles.avatarWrapper}>
              <Image
                style={styles.profileImage}
                resizeMode="cover"
                source={
                  user?.profile?.profile_image
                    ? { uri: user.profile.profile_image }
                    : require('../../../../assets/image/nophoto.jpg')
                }
              />
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>✨</Text>
              </View>
            </View>

            <Text style={styles.name}>{user?.full_name ?? ''}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>

            {user?.created_at && (
              <View style={styles.memberBadge}>
                <Text style={styles.memberSince}>
                  🎉 Member since{' '}
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
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
                onPress={() => handleSettingPress(item)}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Image source={item.icon} style={styles.settingIcon} />
                  </View>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                </View>

                <Image
                  source={require('../../../../assets/image/next1.png')}
                  style={styles.arrow}
                />
              </Pressable>
            ))}
          </View>

          {/* LOGOUT BUTTON */}
          <Pressable
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Image
              source={require('../../../../assets/image/logout.png')}
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>🚪</Text>
            </View>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalConfirmText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalIconContainer, styles.deleteIconContainer]}>
              <Text style={styles.modalIcon}>⚠️</Text>
            </View>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              This action is permanent and cannot be undone. All your data, including lists, bookmarks, and preferences, will be permanently deleted.
            </Text>
            <Text style={styles.modalWarning}>
              Are you sure you want to proceed?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Delete Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}