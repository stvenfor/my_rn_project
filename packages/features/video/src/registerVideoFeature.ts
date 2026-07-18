import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {VideoScreen, ShortVideoScreen, ShortVideoPlayScreen} from './screens';
import {DubbingVideoListScreen} from './screens/DubbingVideoListScreen';
import {DubbingWorkListScreen} from './screens/DubbingWorkListScreen';
import {DubbingVideoDetailScreen} from './screens/DubbingVideoDetailScreen';
import {DubbingWorkDetailScreen} from './screens/DubbingWorkDetailScreen';

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
      {
        name: RoutePath.dubbingVideoList,
        component: DubbingVideoListScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dubbingWorkList,
        component: DubbingWorkListScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dubbingVideoDetail,
        component: DubbingVideoDetailScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dubbingWorkDetail,
        component: DubbingWorkDetailScreen as StackScreenComponent,
      },
    ],
  };
}
