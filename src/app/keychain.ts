import * as Keychain from 'react-native-keychain';
import { store } from './store';
import { setCredentials, logout } from '../features/auth/authSlice';
import { TokenService } from '../services/storage/keychain.services';

export const loadTokenFromKeychain = async () => {
  const token = await TokenService.get();

  if (token) {
    store.dispatch(setCredentials({ token }));
  }
};

export const saveTokenToKeychain = async (token: string) => {
  await TokenService.save(token);
  store.dispatch(setCredentials({ token }));
};

export const removeTokenFromKeychain = async () => {
  await TokenService.remove();
  store.dispatch(logout());
};
