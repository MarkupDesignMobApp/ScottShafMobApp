import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { TabNavigator, DrawerNavigator } from '../index';
import {Editprofile} from "../../screens/index"
import inviteScreen from '../../screens/main/Invite&Refer/inviteScreen';
import ListDetailScreen from '../../screens/main/List/AddItems';
import BrowseCatalogScreen from '../../screens/main/campaign/CatlogScreen';
import CreateListScreen from '../../screens/main/List/CreateList';
import AddCustomItem from '../../screens/main/List/AddCustomItem';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
       <Stack.Screen name="EditProfile" component={Editprofile}/>
    </Stack.Navigator>
  );
}
