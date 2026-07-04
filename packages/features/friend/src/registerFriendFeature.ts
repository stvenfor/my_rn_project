import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {FriendScreen} from './index';

export function registerFriendFeature(): FeatureRegistration {
  return {
    moduleId: 'friend',
    routes: [
      {name: RoutePath.friend, component: FriendScreen as StackScreenComponent},
    ],
  };
}
