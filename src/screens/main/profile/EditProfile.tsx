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
} from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
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
  const [selected, setSelected] = React.useState<string | null>(null);
  const [budgetText, setBudgetText] = React.useState('');
  const MAX_WORDS = 200;
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

  const selectedLabel = selected
    ? categories.find(c => c.code === selected)?.name ?? ''
    : '';

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
            {/* LIST TITLE */}
            {/* <View style={[styles2.fieldWrapper]}>
            <Text style={styles2.floatingLabel}>Name*</Text>
            <TextInput
              placeholder="e.g. Sarah Johnson"
              placeholderTextColor="#B5B5B5"
              style={styles2.input}
            />
          </View> */}
            <AppInput
              placeholder="e.g. Sarah Johnson"
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Name
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />
            {/* email */}
            <AppInput
              placeholder="e.g. sarah.johnson@gmail.com"
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  Email
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
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
                <Text style={{ ...styles2.labeltxt }}>
                  Age
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />

            {/* city */}
            <AppInput
              placeholder="e.g. San Francisco"
              label={
                <Text style={{ ...styles2.labeltxt }}>
                  City
                  <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                </Text>
              }
            />

            {/* Budget Preference* */}
            <AppInput
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
                  keyboardType=""
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
      </KeyboardAvoidingView>
    </View>
  );
}
