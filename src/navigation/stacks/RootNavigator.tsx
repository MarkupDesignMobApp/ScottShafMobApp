import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../app/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { loadTokenFromKeychain } from '../../app/keychain';

export default function RootNavigator() {
  const token = useAppSelector(state => state.auth.token);

  const [isReady, setIsReady] = useState(false);

  // Load token from Keychain on app start
  useEffect(() => {
    const init = async () => {
      await loadTokenFromKeychain();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) return null; // or SplashScreen

  return (
    <NavigationContainer>
      {!token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
