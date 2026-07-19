export function resolveIsDark(
  themeMode: 'light' | 'dark' | 'system',
  systemDark: boolean,
): boolean {
  if (themeMode === 'dark') {
    return true;
  }
  if (themeMode === 'light') {
    return false;
  }
  return systemDark;
}
