import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

import { Login, Register,Otp } from '../../screens';
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Register" component={Register} />
      
    </Stack.Navigator>
  );
}
