// navigation/navigateDeepLink.ts
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from './NavigationRef';
import { Linking } from 'react-native';

/**
 * Navigate inside app from a URL
 */
export const navigateDeepLink = (url: string) => {
  // Parse path from your linking config
  // Example: "https://www.markupdesigns.net/scott-shafer/featured-lists/8"
  const path = url.replace('https://www.markupdesigns.net/', '');
  const parts = path.split('/');

  if (parts[0] === 'scott-shafer' && parts[1] === 'featured-lists' && parts[2]) {
    const itemId = parts[2];

    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'Tabs',
        params: {
          screen: 'Home',
          params: {
            screen: 'FeaturedDetail',
            params: { itemId },
          },
        },
      })
    );
  } else {
    // fallback
    navigationRef.current?.dispatch(
      CommonActions.navigate('Tabs')
    );
  }
};
