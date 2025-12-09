// src/storage/AppStorage.ts
import { createAsyncStorage } from "@react-native-async-storage/async-storage";

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

// Create your scoped storage (completely isolated)
const storage = createAsyncStorage("app-storage");

export const AppStorage: IAppStorage = {
  async setItem(key, value) {
    return storage.setItem(key, value);
  },

  async getItem(key) {
    return storage.getItem(key);
  },

  async removeItem(key) {
    return storage.removeItem(key);
  },

  async setMany(items) {
    return storage.setMany(items);
  },

  async getMany(keys) {
    return storage.getMany(keys);
  },

  async removeMany(keys) {
    return storage.removeMany(keys);
  },

  async getAllKeys() {
    return storage.getAllKeys();
  },

  async clear() {
    return storage.clear();
  },
};
