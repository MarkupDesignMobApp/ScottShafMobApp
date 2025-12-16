import React from 'react';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const OpenLinkInApp = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#ffffff',
        preferredControlTintColor: '#000000',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'pageSheet',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: true,
        // Android properties
        showTitle: true,
        toolbarColor: '#ffffff',
        secondaryToolbarColor: '#ffffff',
        navigationBarColor: '#ffffff',
        navigationBarDividerColor: '#000000',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
      });
    } else {
      // fallback for devices that don’t support InAppBrowser
      Linking.openURL(url);
    }
  } catch (error) {
    console.error(error);
  }
};
