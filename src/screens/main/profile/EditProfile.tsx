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
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { styles2 } from './styles';
import { styles as Homestyle } from '../../auth/Login/styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';

export default function EditProfile({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [budgetText, setBudgetText] = useState('');
  const [profileImage, setProfileImage] = useState<any>(null);

  const MAX_WORDS = 200;

  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { data: profileResponse, isLoading: profileLoading } =
    useGetUserProfileQuery();

  /* ------------------ LOAD PROFILE ------------------ */
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

  /* ------------------ CAMERA PERMISSION ------------------ */
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

  /* ------------------ IMAGE PICKERS ------------------ */
  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.assets?.length) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.assets?.length) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  /* ------------------ BUDGET WORD LIMIT ------------------ */
  const handleBudgetChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) {
      setBudgetText(text);
    }
  };

  /* ------------------ SAVE PROFILE ------------------ */
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

      if (profileImage?.uri) {
        formData.append('profile_image', {
          uri: profileImage.uri,
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

  /* ====================== UI ====================== */
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingBottom: responsiveScreenHeight(8),
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
                source={require('../../../../assets/image/camera.png')}
                style={styles2.img}
              />
            </Pressable>
          </View>

          {/* NAME */}
          <AppInput
            editable={false}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Sarah Johnson"
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
            style={{ width: '100%' }}
            activeOpacity={0.8}
          // onPress={() => {
          //   Keyboard.dismiss();
          //   setTimeout(() => setModalVisible(true), 150);
          // }}
          >
            <View pointerEvents="none">
              <AppInput
                onChangeText={setAge}
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
          {/* CITY */}
          <AppInput
            value={city}
            onChangeText={setCity}
            placeholder="e.g. San Francisco"
            label={<Text style={Homestyle.labeltxt}>City *</Text>}
          />

          {/* BUDGET */}
          <Text style={styles2.labeltxt}>Budget Preference *</Text>
          <View style={styles2.paragraph}>
            <TextInput
              value={budgetText}
              onChangeText={handleBudgetChange}
              multiline
              placeholder="Love exploring new restaurants and hidden gems..."
              textAlignVertical="top"
              style={{ height: 120 }}
            />
          </View>
          <Text style={styles2.wordcapacity}>
            {budgetText.trim()
              ? budgetText.trim().split(/\s+/).length
              : 0}
            /200 Words
          </Text>

          <AppButton title="Save Changes" onPress={handleSaveChanges} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
