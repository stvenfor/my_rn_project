import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {LiveScreen, LiveRoomScreen} from './index';

export function registerLiveFeature(): FeatureRegistration {
  return {
    moduleId: 'live',
    routes: [
      {name: RoutePath.live, component: LiveScreen as StackScreenComponent},
      {
        name: RoutePath.liveRoom,
        component: LiveRoomScreen as StackScreenComponent,
      },
    ],
  };
}
