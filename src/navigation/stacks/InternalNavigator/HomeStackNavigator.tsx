// ProfileStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home,FeaturedLists,FeaturedDetailScreen  } from '../../../screens';

export type HomeStackParamList = {
  Home: undefined;
  FeaturedDetail: { itemId: string };
};


const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Feature" component={FeaturedLists} />
        <Stack.Screen name="FeaturedDetail" component={FeaturedDetailScreen} />
      {/* <Stack.Screen name="ProfileEdit" component={Editprofile} /> */}
      
    </Stack.Navigator>
  );
}
