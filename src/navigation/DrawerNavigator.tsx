import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './types/navigation';
import SettingScreen from '../screens/main/setting/SettingScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Settings" component={SettingScreen} />
    </Drawer.Navigator>
  );
}
