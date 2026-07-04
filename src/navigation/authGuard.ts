export function createAuthTabListener(
  isLoggedIn: boolean,
  navigateToLogin: () => void,
) {
  return {
    tabPress: (e: {preventDefault: () => void}) => {
      if (!isLoggedIn) {
        e.preventDefault();
        navigateToLogin();
      }
    },
  };
}
