import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Modal,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { styles, styles2 } from './styles';
import { styles as Homestyle } from '../../auth/Login/styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useFocusEffect } from '@react-navigation/native';

export default function EditProfile({ navigation, route }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [budgetText, setBudgetText] = useState('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const MAX_WORDS = 200;

  const AGE_OPTIONS = ['18-24', '25-35', '36-50', '50+'];
  const BUDGET_OPTIONS = ['Below 100$', '100$-400$', '500$-1000$'];

  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { data: profileResponse, isLoading: profileLoading } =
    useGetUserProfileQuery();

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }, []),
  );

  useEffect(() => {
    if (profileResponse?.success) {
      const user = profileResponse.data.user;

      setName(user.full_name ?? '');
      setEmail(user.email ?? '');
      setCity(user.profile?.city ?? '');
      setAge(user.profile?.age_band ?? '');
      setBudgetText(user.profile?.dining_budget ?? '');
      setProfileImage(user.profile?.profile_image ?? null);
    }
  }, [profileResponse]);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera access',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      response => {
        if (response.assets?.length) {
          setProfileImage(response.assets[0]);
        }
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      response => {
        if (response.assets?.length) {
          setProfileImage(response.assets[0]);
        }
      },
    );
  };

  const handleBudgetChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) {
      setBudgetText(text);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      formData.append('_method', 'POST');
      formData.append('full_name', name);
      formData.append('city', city);
      formData.append('dining_budget', budgetText);
      formData.append('has_dogs', '0');

      if (age) {
        formData.append('age_band', age);
      }

      if (profileImage && typeof profileImage === 'object') {
        formData.append('profile_image', {
          uri:
            Platform.OS === 'ios'
              ? profileImage.uri.replace('file://', '')
              : profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.fileName || `profile_${Date.now()}.jpg`,
        } as any);
      }

      const res = await updateProfile(formData).unwrap();

      Alert.alert('Success', res.message);

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Update failed');
    }
  };

  return (
    <View style={styles2.container}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading || profileLoading} />

      <AppHeader
        title="Edit Profile"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingBottom: responsiveScreenHeight(18),
          }}
        >
          {/* PROFILE IMAGE */}

          <View style={styles2.profile}>
            <Image
              resizeMode="cover"
              style={styles2.img}
              source={
                profileImage
                  ? { uri: profileImage?.uri ?? profileImage }
                  : require('../../../../assets/image/women1.png')
              }
            />

            <Pressable
              style={styles2.camcontainer}
              onPress={() =>
                Alert.alert('Update Photo', 'Choose option', [
                  { text: 'Camera', onPress: openCamera },
                  { text: 'Gallery', onPress: openGallery },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <Image
                source={require('../../../../assets/image/camera.png')}
                style={styles.cammaincontainer}
              />
            </Pressable>
          </View>

          {/* NAME */}

          <AppInput
            value={name}
            editable={false}
            label={<Text style={Homestyle.labeltxt}>Name *</Text>}
          />

          {/* EMAIL */}

          <AppInput
            value={email}
            editable={false}
            label={<Text style={Homestyle.labeltxt}>Email *</Text>}
          />

          {/* AGE */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setAgeModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                placeholder="Select Age"
                value={age}
                label={
                  <Text style={Homestyle.labeltxt}>
                    Age <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>

          {/* CITY */}

          <AppInput
            value={city}
            onChangeText={setCity}
            placeholder="Enter Country"
            label={
              <Text style={Homestyle.labeltxt}>
                Country <Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
          />

          {/* BUDGET */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setBudgetModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                placeholder="Select Budget"
                value={budgetText}
                label={
                  <Text style={Homestyle.labeltxt}>
                    Budget Preference <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>

          {/* DESCRIPTION */}

          <Text style={styles2.labeltxt}>Describe your budget *</Text>

          <View style={styles2.paragraph}>
            <TextInput
              value={budgetText}
              onChangeText={handleBudgetChange}
              multiline
              textAlignVertical="top"
              style={{ height: 120 }}
            />
          </View>

          <Text style={styles2.wordcapacity}>
            {budgetText.trim() ? budgetText.trim().split(/\s+/).length : 0}/200
            Words
          </Text>
        </ScrollView>

        {/* SAVE BUTTON */}

        <View style={styles2.bottomButtonContainer}>
          <Pressable style={styles2.saveButton} onPress={handleSaveChanges}>
            <Text style={styles2.saveButtonText}>Save Changes</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* AGE MODAL */}

      <Modal visible={ageModalVisible} transparent animationType="slide">
        <Pressable
          style={styles2.modalBg}
          onPress={() => setAgeModalVisible(false)}
        >
          <View style={styles2.modalCard}>
            <Text style={styles2.modalTitle}>Select Age</Text>

            {AGE_OPTIONS.map(item => (
              <Pressable
                key={item}
                style={styles2.modalItem}
                onPress={() => {
                  setAge(item);
                  setAgeModalVisible(false);
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* BUDGET MODAL */}

      <Modal visible={budgetModalVisible} transparent animationType="slide">
        <Pressable
          style={styles2.modalBg}
          onPress={() => setBudgetModalVisible(false)}
        >
          <View style={styles2.modalCard}>
            <Text style={styles2.modalTitle}>Select Budget</Text>

            {BUDGET_OPTIONS.map(item => (
              <Pressable
                key={item}
                style={styles2.modalItem}
                onPress={() => {
                  setBudgetText(item);
                  setBudgetModalVisible(false);
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
