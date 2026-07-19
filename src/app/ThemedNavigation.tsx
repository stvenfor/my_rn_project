import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {useAppSelector} from '@app/store/hooks';
import {selectThemeMode} from '@app/store/appSlice';
import {RootNavigator} from '@app/navigation/RootNavigator';
import {resolveIsDark} from './resolveIsDark';

export {resolveIsDark} from './resolveIsDark';

const lightNavTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1A1A1A',
    border: '#C6C6C8',
    notification: '#007AFF',
  },
};

const darkNavTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#0A84FF',
  },
};

/** Applies Redux themeMode to NavigationContainer + StatusBar (Flutter GetMaterialApp themeMode). */
export function ThemedNavigation() {
  const themeMode = useAppSelector(selectThemeMode);
  const systemScheme = useColorScheme();
  const systemDark = systemScheme === 'dark';
  const isDark = resolveIsDark(themeMode, systemDark);

  return (
    <>
      <StatusBar
        translucent
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />
      <NavigationContainer theme={isDark ? darkNavTheme : lightNavTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
