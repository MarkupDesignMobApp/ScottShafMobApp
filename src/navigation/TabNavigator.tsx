import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types/navigation';
import HomeScreen from '../screens/main/home/HomeScreen';
import ProfileScreen from '../screens/main/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
