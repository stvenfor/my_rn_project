import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {musicReducer} from './musicSlice';
import {MusicListScreen, MusicNowPlayingScreen} from './screens/MusicScreens';

export function registerMusicFeature(): FeatureRegistration {
  return {
    moduleId: 'music',
    reducer: {key: 'music', reducer: musicReducer},
    routes: [
      {
        name: RoutePath.musicList,
        component: MusicListScreen as StackScreenComponent,
      },
      {
        name: RoutePath.musicNowPlaying,
        component: MusicNowPlayingScreen as StackScreenComponent,
      },
    ],
  };
}
