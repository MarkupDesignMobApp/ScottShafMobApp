// src/hooks/useStorage.ts
import { useCallback, useState } from "react";
import { AppStorage } from "../services/storage/storage.services";

export const useStorage = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = useCallback(async (key: string, value: string) => {
    setLoading(true);
    await AppStorage.setItem(key, value);
    setLoading(false);
  }, []);

  const readItem = useCallback(async (key: string) => {
    setLoading(true);
    const value = await AppStorage.getItem(key);
    setLoading(false);
    return value;
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    setLoading(true);
    await AppStorage.removeItem(key);
    setLoading(false);
  }, []);

  return {
    saveItem,
    readItem,
    deleteItem,
    loading
  };
};
