import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {musicReducer} from './musicSlice';
import {MusicListScreen} from './screens/MusicListScreen';
import {MusicNowPlayingScreen} from './screens/MusicNowPlayingScreen';
import {
  musicBackgroundSharedElementId,
  musicCoverSharedElementId,
} from './models/localSong';

export function registerMusicFeature(): FeatureRegistration {
  return {
    moduleId: 'music',
    reducer: {key: 'music', reducer: musicReducer},
    routes: [
      {
        name: RoutePath.musicList,
        component: MusicListScreen as StackScreenComponent,
        sharedElements: (_route, otherRoute) => {
          if (otherRoute?.name !== RoutePath.musicNowPlaying) {
            return [];
          }
          const trackId = otherRoute.params?.trackId as string | undefined;
          if (!trackId) {
            return [];
          }
          return [
            musicCoverSharedElementId(trackId),
            musicBackgroundSharedElementId(trackId),
          ];
        },
      },
      {
        name: RoutePath.musicNowPlaying,
        component: MusicNowPlayingScreen as StackScreenComponent,
        sharedElements: (route, otherRoute) => {
          if (otherRoute?.name !== RoutePath.musicList) {
            return [];
          }
          const trackId = route.params?.trackId as string | undefined;
          if (!trackId) {
            return [];
          }
          return [
            musicCoverSharedElementId(trackId),
            musicBackgroundSharedElementId(trackId),
          ];
        },
      },
    ],
  };
}
