/** Auth visual tokens — aligned with Flutter `AuthTheme` (iOS minimal). */
export const authTheme = {
  // iOS system colors (Flutter AuthTheme)
  accent: '#007AFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  fillSecondary: '#E9E9EB',
  labelPrimary: '#000000',
  labelSecondary: 'rgba(60, 60, 67, 0.60)',
  labelTertiary: 'rgba(60, 60, 67, 0.30)',
  separator: '#C6C6C8',
  buttonDisabled: '#C7C7CC',

  // Compat aliases
  primaryBlue: '#007AFF',
  titleBlack: '#000000',
  textGray: 'rgba(60, 60, 67, 0.60)',
  linkGray: 'rgba(60, 60, 67, 0.60)',
  dividerGray: '#C6C6C8',
  inputHint: 'rgba(60, 60, 67, 0.30)',
  countryCodeBg: '#E9E9EB',
  screenBackground: '#F2F2F7',

  radiusMd: 12,
  radiusLg: 14,
  fieldHeight: 52,
  buttonHeight: 52,
  horizontalPadding: 24,

  // Legacy LoginPassword / LoginOtp pages (white underline style)
  legacyScreenBackground: '#FFFFFF',
  legacyHorizontalPadding: 28,
  legacyButtonHeight: 48,
  legacyButtonRadius: 4,
} as const;

export const authTextStyles = {
  largeTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: authTheme.labelPrimary,
    lineHeight: 32 * 1.15,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: authTheme.labelSecondary,
    lineHeight: 15 * 1.4,
  },
  fieldText: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: authTheme.labelPrimary,
    lineHeight: 17 * 1.2,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: authTheme.labelSecondary,
    lineHeight: 13 * 1.35,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    lineHeight: 17 * 1.2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: authTheme.labelSecondary,
    lineHeight: 13 * 1.35,
    letterSpacing: -0.08,
  },
} as const;
