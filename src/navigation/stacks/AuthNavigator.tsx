import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

import {
  Login,
  Register,
  Otp,
  SocialAuth,
  Signup,
  Privacy,
  TermCondition,
  IntrestPick,
  About,
} from '../../screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Splash" component={Splash} /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Socialauth" component={SocialAuth} />
      <Stack.Screen name="Signup" component={Signup} />
     
      <Stack.Screen name="TermCondition" component={TermCondition} />
      <Stack.Screen name="Intrestpick" component={IntrestPick} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
}
