jest.mock('@app/store/mainTabSlice', () => ({
  switchToMainTabModule: (moduleId: string) => ({
    type: 'mainTab/switchToModule/mock',
    meta: {moduleId},
  }),
}));

import type {PendingNavigation} from '@core/linking';
import {RoutePath} from '@core/navigation';
import {applyLinkingNavigation, resolveLinkingModuleId} from '../navigation/applyLinkingNavigation';

const dispatch = jest.fn(async (action: unknown) => action);
const navigate = jest.fn();

const navigation = {
  navigate,
} as never;

describe('applyLinkingNavigation', () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
  });

  it('resolveLinkingModuleId maps tab routes', () => {
    expect(resolveLinkingModuleId('CommunityTab')).toBe('community');
    expect(resolveLinkingModuleId('MineTab')).toBe('settings');
  });

  it('switches to main and dispatches tab module for tab routes', async () => {
    const pending: PendingNavigation = {route: 'CommunityTab'};
    const ok = await applyLinkingNavigation(pending, {
      dispatch,
      navigation,
      isLoggedIn: true,
    });

    expect(ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith(RoutePath.main);
    expect(dispatch).toHaveBeenCalled();
  });

  it('redirects to login when auth-required tab and guest', async () => {
    const pending: PendingNavigation = {route: 'ChatTab'};
    const ok = await applyLinkingNavigation(pending, {
      dispatch,
      navigation,
      isLoggedIn: false,
    });

    expect(ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith(RoutePath.login);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('navigates to login route directly', async () => {
    const pending: PendingNavigation = {
      route: RoutePath.login,
      params: {from: 'push'},
    };
    const ok = await applyLinkingNavigation(pending, {
      dispatch,
      navigation,
      isLoggedIn: false,
    });

    expect(ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith(RoutePath.login);
  });
});
