import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../app/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Splashscreen from '../../screens/Splash/Splashscreen';
import OnboardingScreen from '../../screens/auth/Onboarding/onBoardingScreen';
import { loadTokenFromKeychain } from '../../app/keychain';
import { AppStorage } from '../../services/storage/storage.services';

const ONBOARDING_KEY = 'HAS_SEEN_ONBOARDING';

export default function RootNavigator() {
  const token = useAppSelector(state => state.auth.token);

  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        loadTokenFromKeychain(),
        new Promise(resolve => setTimeout(resolve, 800)),
      ]);

      const seen = await AppStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(seen === 'true');

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady || hasSeenOnboarding === null) {
    return <Splashscreen />;
  }

  return (
    <NavigationContainer>
      {!hasSeenOnboarding ? (
        <OnboardingScreen onFinish={() => setHasSeenOnboarding(true)} />
      ) : token ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
