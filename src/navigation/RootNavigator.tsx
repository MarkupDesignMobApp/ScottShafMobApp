import { NavigationContainer } from '@react-navigation/native';
// import { useAppSelector } from '../store/store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
//   const { isLoggedIn } = useAppSelector(state => state.auth);

  return (
    <NavigationContainer>
        <AuthNavigator/>
      {/* {isLoggedIn ? <MainNavigator /> : <AuthNavigator />} */}
    </NavigationContainer>
  );
}
