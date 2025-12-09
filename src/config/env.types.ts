export type AppEnvironment = "local" | "production";

export interface EnvironmentConfig {
  env: AppEnvironment;
  apiUrl: string;
  enableLogs: boolean;
  firebaseApiKey: string;
}
