import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../app/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { loadTokenFromKeychain } from '../../app/keychain';
import Splashscreen from '../../screens/Splash/Splashscreen';

export default function RootNavigator() {
  const token = useAppSelector(state => state.auth.token);

  const [isReady, setIsReady] = useState(false);

  // Load token from Keychain on app start
  useEffect(() => {
    const init = async () => {
      await loadTokenFromKeychain();
       await new Promise(res => setTimeout(res, 800));
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) return <Splashscreen/>; // or SplashScreen

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
