import type {PendingNavigation} from '@core/linking';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import type {AppDispatch} from '@app/store';
import {switchToMainTabModule} from '@app/store/mainTabSlice';

const TAB_ROUTE_TO_MODULE: Record<string, string> = {
  HomeTab: 'home',
  ChatTab: 'chat',
  CommunityTab: 'community',
  MineTab: 'settings',
};

const AUTH_REQUIRED_MODULES = new Set(['chat', 'community']);

export function resolveLinkingModuleId(route: string): string | null {
  return TAB_ROUTE_TO_MODULE[route] ?? null;
}

export async function applyLinkingNavigation(
  pending: PendingNavigation,
  {
    dispatch,
    navigation,
    isLoggedIn,
  }: {
    dispatch: AppDispatch;
    navigation: StackNavigationProp<RootStackParamList>;
    isLoggedIn: boolean;
  },
): Promise<boolean> {
  const moduleId = resolveLinkingModuleId(pending.route);

  if (moduleId) {
    if (AUTH_REQUIRED_MODULES.has(moduleId) && !isLoggedIn) {
      navigation.navigate(RoutePath.login);
      return true;
    }

    navigation.navigate(RoutePath.main);
    await dispatch(switchToMainTabModule(moduleId));
    return true;
  }

  if (pending.route === RoutePath.login) {
    navigation.navigate(RoutePath.login);
    return true;
  }

  if (pending.route === RoutePath.musicList) {
    navigation.navigate(RoutePath.musicList);
    return true;
  }

  return false;
}
