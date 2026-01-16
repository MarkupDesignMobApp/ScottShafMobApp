// ProfileStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Profile, Editprofile, Bookmark, MyWishlist } from '../../../screens';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
  ProfileQuestion: undefined;
  Bookmark:undefined;
  MyWishlist:undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={Editprofile} />
       <Stack.Screen name="Bookmark" component={Bookmark} />
       <Stack.Screen name="MyWishlist" component={MyWishlist} />
      
    </Stack.Navigator>
  );
}
