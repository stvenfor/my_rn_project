import React from 'react';
import {i18n} from '@core/i18n';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {
  logoutThunk,
  selectIsLoggedIn,
  selectUser,
  updateUserSession,
} from '@features/auth';
import {
  MineScreen,
  SettingsScreen,
  type MineScreenProps,
  type SettingsScreenProps,
} from '@features/settings';
import {useAppDispatch, useAppSelector} from '@app/store/hooks';
import {
  setLocale,
  setThemeMode,
  selectThemeMode,
  selectLocale,
} from '@app/store/appSlice';
import type {AppEnv} from '@core/domain';
import {setEnv, selectCurrentEnv} from '@app/store/envSlice';

export function MineScreenContainer(
  props: Omit<
    MineScreenProps,
    'isLoggedIn' | 'user' | 'onLogout' | 'onUpdateAvatar'
  >,
) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    props.navigation.navigate(RoutePath.login);
  };

  const handleUpdateAvatar = (uri: string) => {
    if (!user) {
      return;
    }
    dispatch(updateUserSession({...user, avatar: uri}));
  };

  return (
    <MineScreen
      {...props}
      isLoggedIn={isLoggedIn}
      user={user}
      onLogout={handleLogout}
      onUpdateAvatar={handleUpdateAvatar}
    />
  );
}

export function SettingsScreenContainer(
  props: RootStackScreenProps<typeof RoutePath.settings>,
) {
  const dispatch = useAppDispatch();
  const currentEnv = useAppSelector(selectCurrentEnv);
  const themeMode = useAppSelector(selectThemeMode);
  const locale = useAppSelector(selectLocale);

  const settingsProps: SettingsScreenProps = {
    ...props,
    currentEnv,
    themeMode,
    locale,
    onSetEnv: (env: AppEnv) => {
      dispatch(setEnv(env));
    },
    onSetLocale: (nextLocale: 'zh' | 'en') => {
      i18n.changeLanguage(nextLocale);
      dispatch(setLocale(nextLocale));
    },
    onToggleTheme: () => {
      const next =
        themeMode === 'light'
          ? 'dark'
          : themeMode === 'dark'
          ? 'light'
          : 'dark';
      dispatch(setThemeMode(next));
    },
  };

  return <SettingsScreen {...settingsProps} />;
}
