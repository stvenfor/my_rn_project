import type {AppEnv, User} from '@core/domain';
import type {MainTabScreenProps, RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';

export interface MineScreenProps extends MainTabScreenProps<'MineTab'> {
  isLoggedIn: boolean;
  user: User | null;
  onLogout: () => Promise<void>;
  onUpdateAvatar: (uri: string) => void;
}

export interface SettingsScreenProps
  extends RootStackScreenProps<typeof RoutePath.settings> {
  currentEnv: AppEnv;
  themeMode: 'light' | 'dark' | 'system';
  locale: 'zh' | 'en';
  onSetEnv: (env: AppEnv) => void;
  onSetLocale: (locale: 'zh' | 'en') => void;
  onToggleTheme: (enabled: boolean) => void;
}
