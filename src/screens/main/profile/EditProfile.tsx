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
import { AppButton } from '../../../components/ui/AppButton/AppButton';
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
  // -------------------- TOP LEVEL HOOKS --------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [budgetText, setBudgetText] = useState('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const MAX_WORDS = 200;
  const userParam = route?.params?.Edit;

  const AGE_OPTIONS = ['18-24', '25-35', '36-50', '50+'];
  const BUDGET_OPTIONS = ['Below 100$', '100$-400$', '500$-1000$'];

  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { data: profileResponse, isLoading: profileLoading } =
    useGetUserProfileQuery();
    

  // -------------------- FOCUS SCROLL --------------------
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }, []),
  );

  // -------------------- LOAD PROFILE --------------------
  useEffect(() => {
    if (profileResponse?.success) {
      const userData = profileResponse.data.user; // rename to avoid shadowing
      console.log(userData)
      setName(userData.full_name ?? '');
      setEmail(userData.email ?? '');
      setCountry(userData.country ?? '');
      setAge(userData.profile?.age_band ?? '');
      setBudgetText(userData.profile?.dining_budget ?? '');
      setProfileImage(userData.profile?.profile_image ?? null);
    }
  }, [profileResponse]);

  // -------------------- CAMERA PERMISSION --------------------
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera access to upload profile photo',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // -------------------- IMAGE PICKERS --------------------
  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
      },
      response => {
        if (response.assets?.length) setProfileImage(response.assets[0]);
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
      },
      response => {
        if (response.assets?.length) setProfileImage(response.assets[0]);
      },
    );
  };

  // -------------------- BUDGET WORD LIMIT --------------------
  const handleBudgetChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) setBudgetText(text);
  };

  // -------------------- SAVE PROFILE --------------------
  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('_method', 'POST');
      formData.append('full_name', name);
      formData.append('country', country);
      formData.append('dining_budget', budgetText);
      formData.append('has_dogs', '0');

      if (age) formData.append('age_band', age);

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
      console.log('UPDATE ERROR 👉', err);
      Alert.alert('Error', err?.data?.message || 'Update failed');
    }
  };

  // -------------------- UI --------------------
  return (
    <View style={styles2.container}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading || profileLoading} />

      <AppHeader
        title={userParam ? 'Edit Profile' : 'My Profile'}
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
            paddingBottom: responsiveScreenHeight(15),
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
                Alert.alert('Update Profile Photo', 'Choose an option', [
                  { text: 'Camera', onPress: openCamera },
                  { text: 'Gallery', onPress: openGallery },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <Image
                resizeMode="contain"
                source={require('../../../../assets/image/camera.png')}
                style={styles.cammaincontainer}
              />
            </Pressable>
          </View>

          {/* NAME */}
          <AppInput
            inputStyle={{ color: 'black' }}
            editable={false}
            value={name}
            placeholder="e.g. Sarah Johnson"
            label={<Text style={Homestyle.labeltxt}>Name *</Text>}
          />

          {/* EMAIL */}
          <AppInput
            inputStyle={{ color: 'black' }}
            value={email}
            editable={false}
            label={<Text style={Homestyle.labeltxt}>Email *</Text>}
          />

          {/* AGE */}
          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setAgeModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                inputStyle={{ color: 'black' }}
                placeholder="Select Age"
                label={
                  <Text style={Homestyle.labeltxt}>
                    Age <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                value={age}
              />
            </View>
          </TouchableOpacity>

          {/* Country */}
          <AppInput
  inputStyle={{ color: 'black' }}
  value={country}
  onChangeText={setCountry}
  placeholder="e.g. India"
  label={
    <Text style={Homestyle.labeltxt}>
      Country <Text style={{ color: 'red' }}>*</Text>
    </Text>
  }
/>


          {/* BUDGET MODAL INPUT */}
          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => setBudgetModalVisible(true), 150);
            }}
          >
            <View pointerEvents="none">
              <AppInput
                inputStyle={{ color: 'black' }}
                placeholder="Select Budget Preference"
                label={
                  <Text style={Homestyle.labeltxt}>
                    Budget Preference <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                }
                value={budgetText}
              />
            </View>
          </TouchableOpacity>

          {/* BUDGET TEXTAREA (optional description) */}
          <Text style={styles2.labeltxt}>Describe your budget *</Text>
          <View style={styles2.paragraph}>
            <TextInput
            inputStyle={{ color: 'black' }}
              value={budgetText}
              onChangeText={handleBudgetChange}
              multiline
              placeholder="Love exploring new restaurants and hidden gems..."
              textAlignVertical="top"
              style={{ height: 120 }}
            />
          </View>
          <Text style={styles2.wordcapacity}>
            {budgetText.trim() ? budgetText.trim().split(/\s+/).length : 0}/200
            Words
          </Text>
        </ScrollView>

        <View style={styles2.bottomButtonContainer}>
          <AppButton title="Save Changes" onPress={handleSaveChanges} />
        </View>
      </KeyboardAvoidingView>

      {/* ---------------- AGE SELECTION MODAL ---------------- */}
      <Modal
        visible={ageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAgeModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setAgeModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}
            >
              Select Age
            </Text>

            {AGE_OPTIONS.map(item => (
              <Pressable
                key={item}
                onPress={() => {
                  setAge(item);
                  setAgeModalVisible(false);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 15 }}>{item}</Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setAgeModalVisible(false)}
              style={{ paddingVertical: 14, marginTop: 5 }}
            >
              <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* ---------------- BUDGET SELECTION MODAL ---------------- */}
      <Modal
        visible={budgetModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setBudgetModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}
            >
              Select Budget
            </Text>

            {BUDGET_OPTIONS.map(item => (
              <Pressable
                key={item}
                onPress={() => {
                  setBudgetText(item);
                  setBudgetModalVisible(false);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 15 }}>{item}</Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setBudgetModalVisible(false)}
              style={{ paddingVertical: 14, marginTop: 5 }}
            >
              <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
