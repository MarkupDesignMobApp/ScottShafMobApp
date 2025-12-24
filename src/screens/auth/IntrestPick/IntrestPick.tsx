import { View, Text } from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { styles } from './styles';
import TwoColumnList from './List';
type RouteParams = {
  Intrestpick: {
    userId: number;
  };
};
export default function IntrestPick() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'Intrestpick'>>();
  const { userId } = route.params;
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
          <TwoColumnList userId={userId} />
        </View>
      </View>
    </View>
  );
}
