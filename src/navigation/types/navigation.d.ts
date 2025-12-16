import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * ---------------------------------------------------------
 * AUTH STACK PARAMS
 * ---------------------------------------------------------
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Otp: undefined;
  Splash: undefined;
  Socialauth: undefined;
  Signup: undefined;
  Privacy: undefined;
};

/**
 * ---------------------------------------------------------
 * TAB NAVIGATOR PARAMS
 * ---------------------------------------------------------
 */
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  CampaignAnalytics: undefined;
  OfferDetail: undefined;
  FeaturedLists : undefined;
};

/**
 * ---------------------------------------------------------
 * DRAWER NAVIGATOR PARAMS
 * ---------------------------------------------------------
 */
export type DrawerParamList = {
  Settings: undefined;
};

/**
 * ---------------------------------------------------------
 * MAIN STACK PARAMS
 * (includes Tabs + Drawer)
 * ---------------------------------------------------------
 */
export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Drawer: NavigatorScreenParams<DrawerParamList> | undefined;
};

/**
 * ---------------------------------------------------------
 * ROOT STACK PARAMS (AUTH ↔ MAIN)
 * ---------------------------------------------------------
 */
export type RootParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainStack: NavigatorScreenParams<MainStackParamList>;
};

/**
 * ---------------------------------------------------------
 * GLOBAL DECLARATION
 * Makes TS understand RootParamList everywhere
 * ---------------------------------------------------------
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootParamList {}
  }
}
