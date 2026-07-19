export const dubbingHomeTheme = {
  background: '#FFFFFF',
  primaryGreen: '#45D1A1',
  titleBlack: '#1A1A1A',
  textGray: '#666666',
  subtitleGray: '#999999',
  searchFieldBackground: '#F5F5F5',
  divider: '#EEEEEE',
  svipGold: '#D4A017',
  viewAllBackground: '#FAFAFA',
  hotRankHeaderPink: '#FFF0F5',
  hotRankSidebarBg: '#F7F8FA',
  hotRankSidebarActive: '#FFFFFF',
  cardRadius: 12,
  sectionTitleSize: 18,
} as const;

export const HOT_RANK_THEMES = {
  pink: {top: '#FDE7E7', bottom: '#EFC3C4'},
  blue: {top: '#E3EDF7', bottom: '#C3D9EF'},
  green: {top: '#E4FDE9', bottom: '#C3EFD0'},
  tan: {top: '#F7EFD4', bottom: '#EFE0C3'},
  purple: {top: '#E4E3FD', bottom: '#C4C3EF'},
  magenta: {top: '#FDE3FA', bottom: '#EFC3E5'},
} as const;

export type HotRankThemeKey = keyof typeof HOT_RANK_THEMES;
