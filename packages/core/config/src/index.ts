import type {AppEnv} from '@core/domain';

export interface EnvConfigEntry {
  env: AppEnv;
  baseUrl: string;
  wsBaseUrl: string;
  label: string;
}

export const ENV_CONFIGS: Record<AppEnv, EnvConfigEntry> = {
  test: {
    env: 'test',
    baseUrl: 'https://www.wanandroid.com/',
    wsBaseUrl: 'wss://mock-ws.test.example.com/realtime/v1/connect',
    label: '测试',
  },
  staging: {
    env: 'staging',
    baseUrl: 'https://www.wanandroid.com/',
    wsBaseUrl: 'wss://mock-ws.staging.example.com/realtime/v1/connect',
    label: '预发',
  },
  production: {
    env: 'production',
    baseUrl: 'https://www.wanandroid.com/',
    wsBaseUrl: 'wss://ws.example.com/realtime/v1/connect',
    label: '线上',
  },
};

export const APP_BUNDLE_ID = 'com.example.myrnproject';

export const ENV_STORAGE_KEY = 'core_app_env';

export const USE_MOCK_AUTH = process.env.USE_MOCK_AUTH !== 'false';
