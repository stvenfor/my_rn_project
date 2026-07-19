import {LoginRedirect, RoutePath} from '@core/navigation';
import {openUsedCarList} from '../navigation/usedCarNavigation';

describe('openUsedCarList', () => {
  beforeEach(() => {
    LoginRedirect.clear();
  });

  it('navigates to list when logged in', () => {
    const navigate = jest.fn();
    openUsedCarList({isLoggedIn: true, navigate});
    expect(navigate).toHaveBeenCalledWith(RoutePath.homeUsedCarList);
    expect(LoginRedirect.peek()).toBeNull();
  });

  it('sets pending redirect and opens login when logged out', () => {
    const navigate = jest.fn();
    openUsedCarList({isLoggedIn: false, navigate});
    expect(LoginRedirect.peek()).toBe(RoutePath.homeUsedCarList);
    expect(navigate).toHaveBeenCalledWith(RoutePath.login);
  });
});
