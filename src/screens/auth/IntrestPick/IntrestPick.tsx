import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import TwoColumnList from './List';
import { styles } from './styles';

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
    <View style={styles.container}>
      <AppHeader
        title="Pick Your Interests"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <View style={styles.innercontainer}>
        <Text style={styles.headtxt}>
          Select at least 3 interests to personalize your experience.
        </Text>

        <TwoColumnList userId={userId} />
      </View>
    </View>
  );
}
