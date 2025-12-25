import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { TabNavigator, DrawerNavigator, } from '../index';
import { Editprofile, Notification, Privacy,OfferDetail} from '../../screens/index';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Offer" component={OfferDetail} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Privacy" component={Privacy} />
    </Stack.Navigator>
  );
}
