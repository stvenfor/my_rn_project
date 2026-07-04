export const colors = {
  primary: '#53D65B',
  primaryDark: '#3FAF46',
  background: '#FFFFFF',
  backgroundDark: '#121212',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#888888',
  border: '#E5E5E5',
  borderLight: '#DDDDDD',
  error: '#E53935',
  surfaceDark: '#1A1A1A',
  surfaceElevated: '#333333',
  surfacePlayer: '#111111',
  accentTeal: '#4DD0C8',
  overlayDark: 'rgba(0,0,0,0.35)',
  overlayLight: 'rgba(255,255,255,0.75)',
  overlayMuted: 'rgba(255,255,255,0.5)',
  overlaySubtle: 'rgba(255,255,255,0.45)',
  overlayFaint: 'rgba(255,255,255,0.15)',
  divider: '#EEEEEE',
  onDark: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {fontSize: 24, fontWeight: '600' as const},
  subtitle: {fontSize: 16, fontWeight: '500' as const},
  body: {fontSize: 14, fontWeight: '400' as const},
  caption: {fontSize: 12, fontWeight: '400' as const},
};

export const lightTheme = {
  dark: false,
  colors: {
    ...colors,
    background: colors.background,
    text: colors.text,
    card: '#F7F7F7',
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    ...colors,
    background: colors.backgroundDark,
    text: colors.onDark,
    card: colors.surfaceDark,
  },
};

export type AppTheme = typeof lightTheme;
