import { NavigationContainer } from '@react-navigation/native';
// import { useAppSelector } from '../store/store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
    const isLoggedIn  = true;

  return (
    <NavigationContainer>
    
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
0