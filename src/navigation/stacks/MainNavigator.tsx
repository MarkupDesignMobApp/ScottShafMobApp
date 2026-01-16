import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { TabNavigator, DrawerNavigator } from '../index';
import {

  Notification,
  Privacy,
  OfferDetail,
  Browsecat,
  AddCustomItem,
  Reorder,
  Invitescreen,Publish,
  ListPublishedScreen,
  MyWishlist
} from '../../screens/index';


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
      <Stack.Screen name="Browsecat" component={Browsecat} />
      <Stack.Screen name="Addcustom" component={AddCustomItem} />
      <Stack.Screen name="Reorder" component={Reorder} />
      <Stack.Screen name="Invitescreen" component={Invitescreen} />
       <Stack.Screen name="Publish" component={Publish} />
       <Stack.Screen name="ListPublishedScreen" component={ListPublishedScreen} />
       {/* <Stack.Screen name="MyWishlist" component={MyWishlist} /> */}
       
       {/* <Stack.Screen name="Bookmark" component={Bookmark} /> */}
    </Stack.Navigator>
  );
}
