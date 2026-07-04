import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {
  VideoScreen,
  ShortVideoScreen,
  ShortVideoPlayScreen,
} from './VideoScreens';

export function registerVideoFeature(): FeatureRegistration {
  return {
    moduleId: 'video',
    routes: [
      {name: RoutePath.video, component: VideoScreen as StackScreenComponent},
      {
        name: RoutePath.shortVideo,
        component: ShortVideoScreen as StackScreenComponent,
      },
      {
        name: RoutePath.shortVideoPlay,
        component: ShortVideoPlayScreen as StackScreenComponent,
      },
    ],
  };
}
