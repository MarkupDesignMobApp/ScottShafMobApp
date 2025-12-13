import * as Keychain from 'react-native-keychain';

const TOKEN_KEY = 'APP_AUTH_TOKEN';

export const TokenService = {
  async save(token: string): Promise<void> {
    try {
      // username must be string → we use a constant key
      await Keychain.setGenericPassword(TOKEN_KEY, token, {
        service: TOKEN_KEY,
      });
    } catch (error) {
      console.error('Error saving token', error);
    }
  },

  async get(): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: TOKEN_KEY,
      });

      // result === false → no credentials stored
      if (!result) return null;

      return result.password;
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  },

  async remove(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: TOKEN_KEY });
    } catch (error) {
      console.error('Error removing token', error);
    }
  },
};
