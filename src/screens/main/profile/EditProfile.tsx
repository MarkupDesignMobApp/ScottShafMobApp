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
import { responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { styles2 } from './styles';
export default function EditProfile({ navigation }) {
  const [categories, setCategories] = React.useState([
    { name: 'Travel', code: 'Travel' },
    { name: 'Movies', code: 'Movies' },
    { name: 'Music', code: 'Music' },
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [budgetText, setBudgetText] = React.useState('');
  const MAX_WORDS = 200;
  const [form, setForm] = React.useState<any>({
    name: '',
    email: '',
    // store interest as array of codes for multi-select
    interest: [],
    age: '',
    city: '',
    budgetPreference: '',
    description: '',
    errors: {}
  });

  // Toggle interest code in the form.interest array
  const toggleInterest = (code: string) => {
    setForm((prev: any) => {
      const arr: string[] = Array.isArray(prev.interest) ? prev.interest : [];
      const exists = arr.includes(code);
      const next = exists ? arr.filter(c => c !== code) : [...arr, code];
      return {
        ...prev,
        interest: next,
        errors: { ...prev.errors, interest: '' }
      };
    });
  };


  const handleBudgetChange = (text: string) => {
    // Remove extra spaces and split into words
    const words = text.trim().split(/\s+/);

    if (words.length <= MAX_WORDS) {
      setBudgetText(text);
    } else {
      // Stop accepting more words
      const limitedText = words.slice(0, MAX_WORDS).join(' ');
      setBudgetText(limitedText);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
      errors: {
        ...prev.errors,
        [key]: '' // clear error when typing
      }
    }));
  };

  const validateForm = () => {
    let errors: any = {};

    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Invalid email';
    }

    if (!form.interest || form.interest.length === 0) errors.interest = 'Interest is required';
    if (!form.age) errors.age = 'Age is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.budgetPreference) errors.budgetPreference = 'Select budget preference';
    if (!form.description.trim()) errors.description = 'Description is required';

    setForm(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('FORM DATA 👉', form);
    }
  };



  return (
    <View style={styles2.container}>
      <StatusBar hidden={false} barStyle="dark-content" />

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
        <View style={{ flex: 1, padding: responsiveScreenWidth(2) }}>
          <View style={styles2.profile}>
            <Image
              resizeMode="cover"
              style={styles2.img}
              source={require('../../../../assets/image/women1.png')}
            />
            <Pressable
              onPress={() => Alert.alert('efef')}
              style={styles2.camcontainer}
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
            contentContainerStyle={{ paddingBottom: 20 }}
          >

            {/* name  */}
            <AppInput
              placeholder="e.g. Sarah Johnson"
              value={form.name}
              onChangeText={text => updateField('name', text)}
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Name
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {form.errors.name && <Text style={styles2.error}>{form.errors.name}</Text>}

            {/* email */}
            <AppInput
              placeholder="e.g. sarah.johnson@gmail.com"
              value={form.email}
              onChangeText={text => updateField('email', text)}
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Email
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {form.errors.email && <Text style={styles2.error}>{form.errors.email}</Text>}

            {/* interest */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveScreenHeight(2), }}>
              <View style={styles2.prefix}>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  source={require('../../../../assets/image/arrow-down.png')}
                />
              </View>

              <TouchableOpacity
                style={{ width: '100%' }}
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => setModalVisible(true), 100);
                }}
              >
                <AppInput
                  label={
                    <Text style={{ ...styles2.labeltxt }}>
                      Interest
                      <Text style={{ color: 'red', fontSize: 18 }}>
                        *
                      </Text>
                    </Text>
                  }
                  // show selected labels comma separated inside the input
                  value={
                    Array.isArray(form.interest) && form.interest.length > 0
                      ? form.interest
                        .map((code: string) => categories.find(c => c.code === code)?.name ?? code)
                        .join(', ')
                      : ''
                  }
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            {form.errors.interest && <Text style={styles2.error}>{form.errors.interest}</Text>}

            {/* selected interest chips */}
            {Array.isArray(form.interest) && form.interest.length > 0 && (
              <View style={styles.chipRow}>
                {form.interest.map((code: string) => {
                  const label = categories.find(c => c.code === code)?.name ?? code;
                  return (
                    <View key={code} style={styles.chip}>
                      <Text style={styles.chipText}>{label}</Text>
                      <TouchableOpacity onPress={() => toggleInterest(code)} style={styles.chipRemove}>
                        <Text style={{ color: '#00C4FA', fontWeight: '600' }}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}




            {/* age */}
            <AppInput
              value={form.age}
              onChangeText={text => updateField('age', text)}
              keyboardType='number-pad'
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Age
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {form.errors.age && <Text style={styles2.error}>{form.errors.age}</Text>}


            {/* city */}
            <AppInput
              placeholder="e.g. San Francisco"
              value={form.city}
              onChangeText={text => updateField('city', text)}
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  City
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
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
            {form.errors.budgetPreference && (
              <Text style={styles2.error}>{form.errors.budgetPreference}</Text>
            )}

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

          </ScrollView>

          <AppButton
            title="Save Changes"
            onPress={() => handleSubmit()}
          />
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