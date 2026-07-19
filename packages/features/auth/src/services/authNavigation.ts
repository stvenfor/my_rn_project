import type {NavigationProp} from '@react-navigation/native';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {AppLoading} from '@ui/design-system';
import {LoginRedirect} from '@core/navigation';

type AuthNavigation = NavigationProp<RootStackParamList>;

export function navigateAfterAuth(navigation: AuthNavigation): void {
  AppLoading.forceHide();
  const redirect = LoginRedirect.takePending();
  if (redirect && redirect !== RoutePath.main) {
    navigation.reset({
      index: 1,
      routes: [{name: RoutePath.main}, {name: redirect as never}],
    });
    return;
  }
  navigation.reset({
    index: 0,
    routes: [{name: RoutePath.main}],
  });
}
