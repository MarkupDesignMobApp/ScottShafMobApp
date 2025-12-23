import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
} from 'react-native';
import React from 'react';
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
  useGetProfileQuery,
  useGetUserProfileQuery,
} from '../../../features/auth/authApi';
import { PermissionsAndroid } from 'react-native';
import Loader from '../../../components/ui/Loader/Loader';
export default function EditProfile({ navigation }) {
  const [categories, setCategories] = React.useState([
    { name: 'Travel', code: 'Travel' },
    { name: 'Movies', code: 'Movies' },
    { name: 'Music', code: 'Music' },
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [budgetText, setBudgetText] = React.useState('');
  const [profileImage, setProfileImage] = React.useState<any>(null);
  const [email, setemail] = React.useState('');
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [age, setage] = React.useState('');

  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { data: profileResponse, isLoading: profileLoading } =
    useGetUserProfileQuery();
  React.useEffect(() => {
    console.log('ddd', profileResponse);
    if (profileResponse?.success) {
      const user = profileResponse.data.user;

      setName(user.full_name ?? '');
      setCity(user.profile?.city ?? '');
      setBudgetText(user.profile?.dining_budget ?? '');
      setemail(user.email ?? '');
      setage(user.profile?.age_band ?? '');
      setProfileImage(user.profile?.profile_image ?? '');
    }
  }, [profileResponse]);

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
  const MAX_WORDS = 200;
  const handleBudgetChange = (text: string) => {
    // remove extra spaces
    const words = text.trim().split(/\s+/);

    if (words.length <= MAX_WORDS) {
      setBudgetText(text);
    } else {
      // limit to 200 words
      const limitedText = words.slice(0, MAX_WORDS).join(' ');
      setBudgetText(limitedText);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      // ⭐ IMPORTANT FOR LARAVEL
      formData.append('_method', 'PUT');

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
    } catch (err: any) {
      console.log('UPDATE ERROR 👉', err);
      Alert.alert('Error', err?.data?.message || 'Update failed');
    }
  };

  const selectedLabel = selected
    ? categories.find(c => c.code === selected)?.name ?? ''
    : '';

  return (
    <View style={styles2.container}>
      <StatusBar hidden={false} barStyle="dark-content" />
      <Loader color="blue" visible={isLoading || profileLoading} />

      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Edit Profile"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 2 : 0}
      >
        <View style={{ flex: 1, padding: responsiveScreenWidth(0) }}>
          <View style={{ ...styles2.profile }}>
            <View style={styles2.cammaincontainer2}>
              <Image
                resizeMode="cover"
                style={styles2.img}
                source={
                  profileImage?.uri
                    ? { uri: profileImage }
                    : require('../../../../assets/image/women1.png')
                }
              />
            </View>
            <Pressable
              style={styles2.camcontainer}
              onPress={() =>
                Alert.alert(
                  'Update Profile Photo',
                  'Choose an option',
                  [
                    { text: 'Camera', onPress: openCamera },
                    { text: 'Gallery', onPress: openGallery },
                    { text: 'Cancel', style: 'cancel' },
                  ],
                  { cancelable: true },
                )
              }
            >
              <View style={styles2.cammaincontainer}>
                <Image
                  resizeMode="contain"
                  style={styles2.img}
                  source={require('../../../../assets/image/camera.png')}
                />
              </View>
            </Pressable>
          </View>

          <ScrollView
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: responsiveScreenWidth(2),
              paddingBottom: responsiveScreenHeight(18), // 👈 reserve footer space
            }}
          >

            {/* name  */}
            <AppInput
              placeholder="e.g. Sarah Johnson"
              label={
                <Text style={{ ...Homestyle.labeltxt }}>
                  Name
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {/* email */}
            <AppInput
              editable={false}
              placeholder="e.g. sarah.johnson@gmail.com"
              value={form.email}
              onChangeText={text => updateField('email', text)}
              label={
                <Text style={{ ...Homestyle.labeltxt }}>
                  Email
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
              value={email}
            />

            {/* interest */}
            <AppInput
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Interest
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />

            {/* age */}
            <AppInput
              label={
                <Text style={{ ...Homestyle.labeltxt }}>
                  Age
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {form.errors.age && <Text style={styles2.error}>{form.errors.age}</Text>}


            {/* city */}
            <AppInput
              placeholder="e.g. San Francisco"
              label={
                <Text style={{ ...Homestyle.labeltxt }}>
                  City
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
              value={city}
            />
            {form.errors.city && <Text style={styles2.error}>{form.errors.city}</Text>}


            {/* Budget Preference* */}
            <AppInput
              value={form.budgetPreference}
              onSelect={item => updateField('budgetPreference', item)}
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Budget Preference
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            <View>
              <Text style={styles2.labeltxt}>
                Budget Preference
                <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
              </Text>

              <View style={styles2.paragraph}>
                <TextInput
                  keyboardType='default'
                  value={budgetText}
                  onChangeText={handleBudgetChange}
                  multiline
                  placeholder="e.g. Love exploring new restaurants and hidden gems in the city!"
                  placeholderTextColor="#B5B5B5"
                  style={{
                    height: '100%',

                    textAlignVertical: 'top', // 👈 starts from top-left
                  }}
                />
              </View>
              {form.errors.description && (
                <Text style={styles2.error}>{form.errors.description}</Text>
              )}

              <Text style={styles2.wordcapacity}>
                {budgetText.trim() === ''
                  ? 0
                  : budgetText.trim().split(/\s+/).length}
                /200 Words
              </Text>
            </View>
            <AppButton
              title="Save Changes"
              onPress={() => Alert.alert('hii')}
            />
          </ScrollView>
        </View>

        {/* Simple modal selector for categories */}
        {modalVisible && (
          <Modal transparent animationType="fade" visible={modalVisible}>
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <ScrollView>
                  {categories.map(item => {
                    const isSelected = Array.isArray(form.interest) && form.interest.includes(item.code);
                    return (
                      <TouchableOpacity key={item.code} style={styles.modalItem} onPress={() => { toggleInterest(item.code); }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={styles.modalItemText}>{item.name}</Text>
                          {isSelected && <Text style={{ color: '#2B8AFF', fontWeight: '700' }}>✔</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity style={styles.modalDone} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Done</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee', },
  modalItemText: { fontSize: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 0, marginBottom: responsiveScreenHeight(1) },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00C4FA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginTop: 8 },
  chipText: { color: '#fff', marginRight: 8 },
  chipRemove: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  modalDone: { marginTop: 12, backgroundColor: '#2B8AFF', paddingVertical: 10, borderRadius: 8 },
});