import React from 'react';
import {i18n} from '@core/i18n';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {getAuthService} from '@core/supabase';
import {logout, selectIsLoggedIn, selectUser} from '@features/auth';
import {
  MineScreen,
  SettingsScreen,
  type MineScreenProps,
  type SettingsScreenProps,
} from '@features/settings';
import {useAppDispatch, useAppSelector} from '@app/store/hooks';
import {setLocale, setThemeMode} from '@app/store/appSlice';
import {setEnv, selectCurrentEnv, selectEnvLabel} from '@app/store/envSlice';

export function MineScreenContainer(
  props: Omit<MineScreenProps, 'isLoggedIn' | 'user' | 'envLabel' | 'onLogout'>,
) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectUser);
  const envLabel = useAppSelector(selectEnvLabel);

  const handleLogout = async () => {
    await getAuthService().signOut();
    dispatch(logout());
    props.navigation.navigate(RoutePath.login);
  };

  return (
    <MineScreen
      {...props}
      isLoggedIn={isLoggedIn}
      user={user}
      envLabel={envLabel}
      onLogout={handleLogout}
    />
  );
}

export function SettingsScreenContainer(
  props: RootStackScreenProps<typeof RoutePath.settings>,
) {
  const dispatch = useAppDispatch();
  const currentEnv = useAppSelector(selectCurrentEnv);

  const settingsProps: SettingsScreenProps = {
    ...props,
    currentEnv,
    onSetEnv: env => {
      dispatch(setEnv(env));
    },
    onSetLocale: locale => {
      i18n.changeLanguage(locale);
      dispatch(setLocale(locale));
    },
    onSetTheme: mode => {
      dispatch(setThemeMode(mode));
    },
  };

  return <SettingsScreen {...settingsProps} />;
}
