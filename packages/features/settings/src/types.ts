import type {AppEnv, User} from '@core/domain';
import type {MainTabScreenProps, RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';

export interface MineScreenProps extends MainTabScreenProps<'MineTab'> {
  isLoggedIn: boolean;
  user: User | null;
  envLabel: string;
  onLogout: () => Promise<void>;
}

export interface SettingsScreenProps
  extends RootStackScreenProps<typeof RoutePath.settings> {
  currentEnv: AppEnv;
  onSetEnv: (env: AppEnv) => void;
  onSetLocale: (locale: 'zh' | 'en') => void;
  onSetTheme: (mode: 'light' | 'dark' | 'system') => void;
}
