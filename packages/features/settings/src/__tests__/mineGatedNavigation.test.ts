import {LoginRedirect, RoutePath} from '@core/navigation';
import {openMineGatedRoute} from '../navigation/mineGatedNavigation';

describe('openMineGatedRoute', () => {
  beforeEach(() => {
    LoginRedirect.clear();
  });

  it('navigates to target when logged in', () => {
    const navigate = jest.fn();
    openMineGatedRoute({
      isLoggedIn: true,
      navigate,
      target: RoutePath.shortVideo,
    });
    expect(navigate).toHaveBeenCalledWith(RoutePath.shortVideo);
    expect(LoginRedirect.peek()).toBeNull();
  });

  it('sets LoginRedirect and opens Login when logged out', () => {
    const navigate = jest.fn();
    openMineGatedRoute({
      isLoggedIn: false,
      navigate,
      target: RoutePath.homeUsedCarList,
    });
    expect(LoginRedirect.peek()).toBe(RoutePath.homeUsedCarList);
    expect(navigate).toHaveBeenCalledWith(RoutePath.login);
  });
});
