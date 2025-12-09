import Config from 'react-native-config';
import { EnvironmentConfig, AppEnvironment } from './env.types';

const parseBoolean = (value?: string): boolean =>
  value === 'true' || value === '1';

export const getEnvConfig = (): EnvironmentConfig => ({
  env: (Config.APP_ENV as AppEnvironment) ?? 'local',
  apiUrl: Config.API_URL ?? '',
  enableLogs: parseBoolean(Config.ENABLE_LOGS),
  firebaseApiKey: Config.FIREBASE_API_KEY ?? '',
});
