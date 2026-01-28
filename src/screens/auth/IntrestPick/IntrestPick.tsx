import { View, Text } from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import TwoColumnList from './List';
export default function IntrestPick() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Pick Your Interests"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={styles.innercontainer}>
        <Text style={styles.headtxt}>
          Select at least 3 categories to personalize your feed.
        </Text>
        <View style={{ flex: 1, width: '100%' }}>
          <TwoColumnList />
        </View>
        <View style={styles.btncontainer}>
          <AppButton
            onPress={() => navigation.navigate('About')}
            title="Submit And Continue"
          />
        </View>
      </View>
    </View>
  );
}
