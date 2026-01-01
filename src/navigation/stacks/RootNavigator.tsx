import React, { useEffect, useState } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Splashscreen from '../../screens/Splash/Splashscreen';
import OnboardingScreen from '../../screens/auth/Onboarding/onBoardingScreen';
import {
  loadTokenFromKeychain,
  removeTokenFromKeychain,
} from '../../app/keychain';
import { AppStorage } from '../../services/storage/storage.services';
import { linking } from '../Linking/linking';
import { navigationRef } from '../NavigationRef';
import {
  setPendingDeepLink,
  consumePendingDeepLink,
} from '../../utils/pendingDeepLink';

const FIRST_LAUNCH_KEY = 'FIRST_LAUNCH_DONE';
const ONBOARDING_KEY = 'HAS_SEEN_ONBOARDING';

export default function RootNavigator() {
  const token = useAppSelector(state => state.auth.token);

  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  // --- Splash + onboarding + token loading ---
  useEffect(() => {
    const init = async () => {
      const isFirstLaunch = !(await AppStorage.getItem(FIRST_LAUNCH_KEY));

      if (isFirstLaunch) {
        await removeTokenFromKeychain();
        await AppStorage.setItem(FIRST_LAUNCH_KEY, 'true');
      } else {
        await loadTokenFromKeychain();
      }

      await new Promise(resolve => setTimeout(resolve, 800)); // splash delay

      const seen = await AppStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(seen === 'true');

      setIsReady(true);
    };

    init();
  }, []);

  // --- Handle incoming deep links (cold start & foreground) ---
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      if (!token) {
        // store pending deep link for replay after login
        setPendingDeepLink(url);
      } else {
        // token exists → navigate immediately
        navigateDeepLink(url);
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then(url => {
      if (url) handleUrl({ url });
    });

    return () => sub.remove();
  }, [token]);

  if (!isReady || hasSeenOnboarding === null) {
    return <Splashscreen />;
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      {!hasSeenOnboarding ? (
        <OnboardingScreen
          onFinish={async () => {
            await AppStorage.setItem(ONBOARDING_KEY, 'true');
            setHasSeenOnboarding(true);
          }}
        />
      ) : token ? (
        <MainNavigator />
      ) : (
        <AuthNavigator
          onLoginSuccess={() => {
            // replay pending deep link after login
            const url = consumePendingDeepLink();
            if (url) {
              setTimeout(() => navigateDeepLink(url), 50); // small delay to ensure MainNavigator is mounted
            }
          }}
        />
      )}
    </NavigationContainer>
  );
}

// --- Helper function to navigate to nested FeaturedDetail ---
export const navigateDeepLink = (url: string) => {
  const match = url.match(/featured-lists\/(\d+)/);
  const itemId = match ? match[1] : null;
  if (!itemId) return;

  navigationRef.current?.reset({
    index: 0,
    routes: [
      {
        name: 'Tabs',
        state: {
          routes: [
            {
              name: 'Home',
              state: {
                routes: [
                  {
                    name: 'FeaturedDetail',
                    params: { itemId },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
};
