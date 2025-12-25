// ProfileStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home,FeaturedLists  } from '../../../screens';

export type HomeStackParamList = {
  HomeMain: undefined;
//   ProfileEdit: undefined;
//   ProfileQuestion: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="Feature" component={FeaturedLists} />
      {/* <Stack.Screen name="ProfileEdit" component={Editprofile} /> */}
      
    </Stack.Navigator>
  );
}
