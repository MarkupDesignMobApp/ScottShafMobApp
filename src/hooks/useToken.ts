import { useState, useCallback } from "react";
import { TokenService } from "../services/storage/keychain.services";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  const saveToken = useCallback(async (value: string) => {
    await TokenService.save(value);
    setToken(value);
  }, []);

  const readToken = useCallback(async () => {
    const value = await TokenService.get();
    setToken(value);
    return value;
  }, []);

  const removeToken = useCallback(async () => {
    await TokenService.remove();
    setToken(null);
  }, []);

  return {
    token,
    saveToken,
    readToken,
    removeToken,
  };
};
