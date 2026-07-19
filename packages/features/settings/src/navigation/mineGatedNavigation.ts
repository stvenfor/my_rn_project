import {LoginRedirect, RoutePath} from '@core/navigation';

type MineGateRoute =
  | typeof RoutePath.homeUsedCarList
  | typeof RoutePath.shortVideo
  | typeof RoutePath.login;

type NavigateFn = (name: MineGateRoute) => void;

/**
 * Aligns with Flutter MineController used_car / short_video gates:
 * logged-in → target; logged-out → Login with LoginRedirect pending.
 */
export function openMineGatedRoute(args: {
  isLoggedIn: boolean;
  navigate: NavigateFn;
  target: typeof RoutePath.homeUsedCarList | typeof RoutePath.shortVideo;
}): void {
  const {isLoggedIn, navigate, target} = args;
  if (isLoggedIn) {
    navigate(target);
    return;
  }
  LoginRedirect.setPending(target);
  navigate(RoutePath.login);
}
