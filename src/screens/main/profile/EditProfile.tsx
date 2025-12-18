import { View, Text, Image, Pressable, Alert, StyleSheet, TextInput, StatusBar, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

export default function EditProfile() {

  const [categories, setCategories] = React.useState([
    { name: 'Travel', code: 'Travel' },
    { name: 'Movies', code: 'Movies' },
    { name: 'Music', code: 'Music' }
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);

  const selectedLabel = selected ? categories.find(c => c.code === selected)?.name ?? '' : '';


  return (
    <View style={styles.container}>
      <StatusBar hidden={false} barStyle='dark-content' />

      <AppHeader
        title="Edit Profile"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={{ flex: 1, padding: responsiveScreenWidth(4), }}>
        <View style={styles.profile}>
          <Image
            resizeMode="cover"
            style={styles.img}
            source={require('../../../../assets/image/women1.png')}
          />
          <Pressable onPress={() => Alert.alert("efef")} style={styles.camcontainer}>
            <View style={styles.cammaincontainer}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/camera.png')}
              />
            </View>
          </Pressable>
        </View>

        <ScrollView>

          {/* LIST TITLE */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>Name*</Text>
            <TextInput
              placeholder="e.g. Sarah Johnson"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
            />
          </View>

          {/* email */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>Email*</Text>
            <TextInput
              placeholder="e.g. sarah.johnson@gmail.com"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
            />
          </View>

          {/* interest */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveScreenHeight(2), }}>
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
                    Interests
                    <Text style={{ color: 'red', fontSize: 18 }}>
                      *
                    </Text>
                  </Text>
                }
                value={selectedLabel}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* age */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveScreenHeight(2), }}>
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
                    Age
                    <Text style={{ color: 'red', fontSize: 18 }}>
                      *
                    </Text>
                  </Text>
                }
                value={selectedLabel}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* city */}
          <View style={[styles.fieldWrapper]}>
            <Text style={styles.floatingLabel}>City*</Text>
            <TextInput
              placeholder="e.g. San Francisco"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
            />
          </View>

          {/* Budget Preference* */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveScreenHeight(2), }}>
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
                    Budget Preference
                    <Text style={{ color: 'red', fontSize: 18 }}>
                      *
                    </Text>
                  </Text>
                }
                value={selectedLabel}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.fieldWrapper, { marginVertical: 0 }]}>
            <Text style={styles.descriptionLabel}>Notes (Optional)</Text>
            <TextInput multiline
              placeholder="Add a short description"
              placeholderTextColor="#B5B5B5"
              style={[styles.input, { borderRadius: 10, height: responsiveScreenHeight(15), textAlignVertical: 'top', }]}
            />
          </View>
        </ScrollView>
        <AppButton title='Save Changes' onPress={() => Alert.alert('hii')} />

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
    borderColor: "#0180FE"
  },
  cammaincontainer: {
    width: responsiveScreenHeight(1.5),
    height: responsiveScreenHeight(1.5)
  },
  floatingLabel: {
    position: "absolute",
    top: -9,
    left: 18,
    backgroundColor: "#FFFFFF", // must be solid
    paddingHorizontal: 6,
    fontSize: 12,
    color: "#8A8A8A",
    zIndex: 20,              // ⭐ label ABOVE everything
  },
  img: {
    width: '100%',
    height: '100%',
  },

  input: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: "#E4E6EB",
    paddingHorizontal: 18,
    fontSize: 14,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
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
  },

  descriptionLabel: {
    paddingHorizontal: 18,
    marginBottom: 6,
    backgroundColor: "#FFFFFF", // must be solid
    fontSize: 12,
    color: "#8A8A8A",
  },
});
