import {LoginRedirect, RoutePath} from '@core/navigation';

type NavigateFn = (name: string, params?: object) => void;

/**
 * Aligns with Flutter `UsedCarNavigation.open`:
 * logged-in → list; logged-out → Login with pending redirect to list.
 */
export function openUsedCarList(args: {
  isLoggedIn: boolean;
  navigate: NavigateFn;
}): void {
  const {isLoggedIn, navigate} = args;
  if (isLoggedIn) {
    navigate(RoutePath.homeUsedCarList);
    return;
  }
  LoginRedirect.setPending(RoutePath.homeUsedCarList);
  navigate(RoutePath.login);
}
