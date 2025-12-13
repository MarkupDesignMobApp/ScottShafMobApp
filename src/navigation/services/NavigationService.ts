import {
  CommonActions,
  DrawerActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { RootParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootParamList>();

// ----------------------------------------------------------
// BASIC NAVIGATION
// ----------------------------------------------------------
export function navigate<T extends keyof RootParamList>(
  name: T,
  params?: RootParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function replace<T extends keyof RootParamList>(
  name: T,
  params?: RootParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function push<T extends keyof RootParamList>(
  name: T,
  params?: RootParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function goBack() {
  if (navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function pop(count: number = 1) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(count));
  }
}

export function popToTop() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
}

// ----------------------------------------------------------
// RESET NAVIGATION (GOOD AFTER LOGIN/LOGOUT)
// ----------------------------------------------------------
export function resetTo<T extends keyof RootParamList>(
  name: T,
  params?: RootParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    );
  }
}

// ----------------------------------------------------------
// DRAWER CONTROLS
// ----------------------------------------------------------
export function openDrawer() {
  navigationRef.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
  navigationRef.dispatch(DrawerActions.closeDrawer());
}

export function toggleDrawer() {
  navigationRef.dispatch(DrawerActions.toggleDrawer());
}

// ----------------------------------------------------------
// ROUTE INFO HELPERS
// ----------------------------------------------------------
export function getCurrentRoute() {
  return navigationRef.getCurrentRoute();
}

export function isFocused() {
  return navigationRef.isFocused();
}

export function getRouteName() {
  return navigationRef.getCurrentRoute()?.name;
}

export function getParams<T>() {
  return navigationRef.getCurrentRoute()?.params as T;
}

// ----------------------------------------------------------
// SAFE NAVIGATION (Runs when ready only)
// ----------------------------------------------------------
export function navigateIfReady<T extends keyof RootParamList>(
  name: T,
  params?: RootParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    setTimeout(() => navigateIfReady(name, params), 50);
  }
}

// ----------------------------------------------------------
// SHORTCUTS (YOU CAN ADD MORE)
// ----------------------------------------------------------
export const NavigationActions = {
  goToLogin: () => navigate('AuthStack', { screen: 'Login' }),

  goToRegister: () => navigate('AuthStack', { screen: 'Register' }),

  goToHome: () =>
    navigate('MainStack', {
      screen: 'Tabs',
      params: { screen: 'Home' },
    }),

  goToProfile: () =>
    navigate('MainStack', {
      screen: 'Tabs',
      params: { screen: 'Profile' },
    }),

  goToTabs: () => navigate('MainStack', { screen: 'Tabs' }),

  goToDrawer: () => navigate('MainStack', { screen: 'Drawer' }),

  logoutAndGoAuth: () => resetTo('AuthStack', { screen: 'Login' }),

  loginSuccessAndGoMain: () => resetTo('MainStack', { screen: 'Tabs' }),
};
