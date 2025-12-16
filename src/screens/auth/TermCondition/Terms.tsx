import { View, Text } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { Checkbox } from '../../../components/ui/index';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
export default function Terms() {
  const [accepted, setAccepted] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.maincontainer}>
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Terms & Privacy"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={styles.innercontainer}>
        <View style={styles.targetcontainer}>
          <View>
            <Text style={styles.switchtxt}>
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting, remaining essentially
              unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </Text>
          </View>
        </View>
        <View style={{ ...styles.checkboxcontainer }}>
          <Checkbox
            checked={accepted}
            onChange={setAccepted}
            label="I accept the terms & Privacy Policy"
          />
        </View>
        <View style={{ ...styles.checkboxcontainer }}>
          <Checkbox
            checked={accepted}
            onChange={setAccepted}
            label="Use my responses for targeted campaigns"
          />
        </View>
        <View style={styles.btncontainer}>
          <AppButton
            onPress={() => navigation.navigate('Intrestpick')}
            title="Submit And Continue"
          />
        </View>
      </View>
    </View>
  );
}
