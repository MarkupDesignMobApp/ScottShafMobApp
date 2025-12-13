import { useLoginMutation } from '../../features/auth/authApi';
import { saveTokenToKeychain } from '../../app/keychain';

export const useLoginLogic = () => {
  const [login, { isLoading, isError }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login({ email, password }).unwrap();

      await saveTokenToKeychain(res.access_token);

    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return {
    handleLogin,
    isLoading,
    isError,
  };
};
