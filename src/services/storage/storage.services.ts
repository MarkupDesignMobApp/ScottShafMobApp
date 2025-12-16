import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageValue = string | null;

export interface IAppStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<StorageValue>;
  removeItem(key: string): Promise<void>;

  setMany(items: Record<string, string>): Promise<void>;
  getMany(keys: string[]): Promise<Record<string, StorageValue>>;
  removeMany(keys: string[]): Promise<void>;

  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

// Optional prefix to avoid key collision
const PREFIX = 'APP_';

const withPrefix = (key: string) => `${PREFIX}${key}`;

export const AppStorage: IAppStorage = {
  async setItem(key, value) {
    await AsyncStorage.setItem(withPrefix(key), value);
  },

  async getItem(key) {
    return AsyncStorage.getItem(withPrefix(key));
  },

  async removeItem(key) {
    await AsyncStorage.removeItem(withPrefix(key));
  },

  async setMany(items) {
    const pairs = Object.entries(items).map(([key, value]) => [
      withPrefix(key),
      value,
    ]);
    await AsyncStorage.multiSet(pairs);
  },

  async getMany(keys) {
    const prefixedKeys = keys.map(withPrefix);
    const result = await AsyncStorage.multiGet(prefixedKeys);

    return result.reduce<Record<string, StorageValue>>((acc, [key, value]) => {
      acc[key.replace(PREFIX, '')] = value;
      return acc;
    }, {});
  },

  async removeMany(keys) {
    const prefixedKeys = keys.map(withPrefix);
    await AsyncStorage.multiRemove(prefixedKeys);
  },

  async getAllKeys() {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter(key => key.startsWith(PREFIX))
      .map(key => key.replace(PREFIX, ''));
  },

  async clear() {
    const keys = await this.getAllKeys();
    await this.removeMany(keys);
  },
};
