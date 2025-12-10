export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Drawer: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
  interface RootParamList extends AuthStackParamList, MainStackParamList {}
  }
}
