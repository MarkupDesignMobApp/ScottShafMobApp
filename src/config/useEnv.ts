import { useMemo } from 'react';
import { getEnvConfig } from './env';

export const useEnv = () => {
  return useMemo(() => getEnvConfig(), []);
};
