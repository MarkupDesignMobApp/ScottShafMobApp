import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

export default function ProfileQuestion() {
  const [categories, setCategories] = React.useState([
    { name: 'Delhi', code: 'Delhi' },
    { name: 'Mumbai', code: 'Mumbai' },
    { name: 'Bengaluru', code: 'Bengaluru' },
    { name: 'Chennai', code: 'Chennai' },
    { name: 'Kolkata', code: 'Kolkata' },
    { name: 'Hyderabad', code: 'Hyderabad' },
    { name: 'Pune', code: 'Pune' },
    { name: 'Ahmedabad', code: 'Ahmedabad' },
    { name: 'Jaipur', code: 'Jaipur' },
    { name: 'Lucknow', code: 'Lucknow' },
    { name: 'Kanpur', code: 'Kanpur' },
    { name: 'Nagpur', code: 'Nagpur' },
    { name: 'Indore', code: 'Indore' },
    { name: 'Bhopal', code: 'Bhopal' },
    { name: 'Coimbatore', code: 'Coimbatore' },
    { name: 'Visakhapatnam', code: 'Visakhapatnam' },
    { name: 'Patna', code: 'Patna' },
    { name: 'Vadodara', code: 'Vadodara' },
    { name: 'Ghaziabad', code: 'Ghaziabad' },
    { name: 'Ludhiana', code: 'Ludhiana' },
    { name: 'Agra', code: 'Agra' },
    { name: 'Nashik', code: 'Nashik' },
    { name: 'Faridabad', code: 'Faridabad' },
    { name: 'Meerut', code: 'Meerut' },
    { name: 'Rajkot', code: 'Rajkot' },
  ]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [selected1, setSelected1] = React.useState('yes');

  const selectedLabel = selected
    ? categories.find(c => c.code === selected)?.name ?? ''
    : '';

  const RadioButton = ({ label, value }) => {
    const isActive = selected1 === value;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelected1(value)}
        style={[styles.radioContainer, isActive && styles.activeContainer]}
      >
        <View style={[styles.outerCircle, isActive && styles.activeOuter]}>
          {isActive && <View style={styles.innerCircle} />}
        </View>

        <Text style={[styles.label, isActive && styles.activeLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} barStyle="dark-content" />

      <AppHeader
        title="Tell Us About Yourself"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={{ flex: 1, padding: responsiveScreenWidth(4) }}>
        <Text style={{ fontSize: 14, fontWeight: '600', margin: 10 }}>
          Help us personalize your experience
        </Text>

        <ScrollView>
          {/* LIST TITLE */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>Age Group**</Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <AppButton
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#3478f6',
                  borderWidth: 1,
                  width: responsiveScreenWidth(40),
                }}
                Textcolor="#3478f6"
                onPress={() => Alert.alert('hi')}
                title="18-24"
              />
              <AppButton
                style={{ width: responsiveScreenWidth(40) }}
                onPress={() => Alert.alert('hi')}
                title="25-34"
              />
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <AppButton
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#3478f6',
                  borderWidth: 1,
                  width: responsiveScreenWidth(40),
                }}
                Textcolor="#3478f6"
                onPress={() => Alert.alert('hi')}
                title="18-24"
              />
              <AppButton
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#3478f6',
                  borderWidth: 1,
                  width: responsiveScreenWidth(40),
                }}
                onPress={() => Alert.alert('hi')}
                title="25-34"
              />
            </View>
          </View>

          {/* interest */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveScreenHeight(2),
            }}
          >
            <View style={styles.prefix}>
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
                  <Text style={{ ...styles.labeltxt }}>
                    City
                    <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                  </Text>
                }
                value={selectedLabel}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* city */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>Monthly budget for dining*</Text>
            <TextInput
              placeholder="Under $100"
              placeholderTextColor="#B5B5B5"
              style={styles.input1}
            />
            <TextInput
              placeholder="$100 - $300"
              placeholderTextColor="#B5B5B5"
              style={styles.input1}
            />
            <TextInput
              placeholder="$300 - $500"
              placeholderTextColor="#B5B5B5"
              style={styles.input1}
            />
            <TextInput
              placeholder="$500+"
              placeholderTextColor="#B5B5B5"
              style={styles.input1}
            />
          </View>

          {/* Budget Preference* */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>Monthly budget for dining*</Text>

            <View style={styles.wrapper}>
              <RadioButton label="Yes" value="yes" />
              <RadioButton label="No" value="no" />
            </View>
          </View>
        </ScrollView>
        <AppButton title="Finish Setup" onPress={() => Alert.alert('hii')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  fieldWrapper: {
    marginTop: responsiveScreenHeight(2),
    zIndex: 10,
  },
  profile: {
    alignSelf: 'center',
    height: responsiveScreenWidth(25),
    width: responsiveScreenWidth(25),
    borderRadius: responsiveScreenWidth(12.5),
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(5),
  },
  wrapper: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFFFFF',
  },

  activeContainer: {
    borderColor: '#2F80FF',
    backgroundColor: '#EEF5FF',
  },

  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  activeOuter: {
    borderColor: '#2F80FF',
  },

  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2F80FF',
  },

  label: {
    fontSize: 16,
    color: '#6B6B6B',
    fontWeight: '500',
  },

  activeLabel: {
    color: '#2F80FF',
    fontWeight: '600',
  },
  camcontainer: {
    borderWidth: 1,
    height: responsiveScreenWidth(8),
    width: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
    right: 10,
    bottom: -12,
    borderColor: '#0180FE',
  },
  cammaincontainer: {
    width: responsiveScreenHeight(1.5),
    height: responsiveScreenHeight(1.5),
  },
  floatingLabel: {
    position: 'absolute',
    top: -15,
    fontWeight: '600',
    backgroundColor: '#FFFFFF', // must be solid
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#000',
    zIndex: 20, // ⭐ label ABOVE everything
  },
  img: {
    width: '100%',
    height: '100%',
  },

  input: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#E4E6EB',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },

  input1: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#E4E6EB',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    marginTop: 10,
  },

  prefix: {
    position: 'absolute',
    paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: '#AEAEAE',
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4),
  },

  labeltxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#000',
  },

  descriptionLabel: {
    paddingHorizontal: 18,
    marginBottom: 6,
    backgroundColor: '#FFFFFF', // must be solid
    fontSize: 12,
    color: '#8A8A8A',
  },
});
