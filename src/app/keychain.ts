import * as Keychain from 'react-native-keychain';
import { store } from './store';
import { setCredentials, logout } from '../features/auth/authSlice';
import { TokenService } from '../services/storage/keychain.services';
export const loadTokenFromKeychain = async () => {
  const credentials = await TokenService.get();

  if (credentials?.token) {
    store.dispatch(
      setCredentials({
        token: credentials.token,
        user: credentials.user,
      }),
    );
  }
};

export const saveTokenToKeychain = async (token: string, user: string) => {
  //   await Keychain.setGenericPassword(token, JSON.stringify(user));
  await TokenService.save(token);
  store.dispatch(setCredentials({ token, user }));
};

export const removeTokenFromKeychain = async () => {
  await TokenService.remove();
  store.dispatch(logout());
};
