export const MAIN_TAB_SEED_COLOR = '#53D65B';

export const MUSIC_MINI_PLAYER_BAR_HEIGHT = 72;
export const MAIN_TAB_BAR_HEIGHT = 80;

export const mainTabBarTheme = {
  light: {
    background: '#FFFFFF',
    indicator: 'rgba(83, 214, 91, 0.18)',
    labelSelected: MAIN_TAB_SEED_COLOR,
    labelUnselected: '#8E9197',
    iconSelected: MAIN_TAB_SEED_COLOR,
    iconUnselected: '#8E9197',
    elevation: 0,
    elevationWithMiniPlayer: 8,
  },
  dark: {
    background: '#1E2126',
    indicator: 'rgba(83, 214, 91, 0.24)',
    labelSelected: MAIN_TAB_SEED_COLOR,
    labelUnselected: '#9EA2A8',
    iconSelected: MAIN_TAB_SEED_COLOR,
    iconUnselected: '#9EA2A8',
    elevation: 0,
    elevationWithMiniPlayer: 8,
  },
} as const;

export type MainTabBarPalette =
  (typeof mainTabBarTheme)[keyof typeof mainTabBarTheme];

export function resolveMainTabBarPalette(
  themeMode: 'light' | 'dark' | 'system',
  systemDark = false,
): MainTabBarPalette {
  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemDark);
  return isDark ? mainTabBarTheme.dark : mainTabBarTheme.light;
}
