jest.mock('@core/media-player', () => ({
  createAudioPlayerService: jest.fn().mockResolvedValue({
    setCallbacks: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    seek: jest.fn(),
    setVolume: jest.fn(),
  }),
  setAudioPlayerService: jest.fn(),
}));

import React from 'react';
import renderer from 'react-test-renderer';
import {MusicListScreen} from '../screens/MusicListScreen';
import {MusicNowPlayingScreen} from '../screens/MusicNowPlayingScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('@react-native-community/blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('@react-native-community/slider', () => 'Slider');

jest.mock('../components/MusicAlbumArt', () => ({
  MusicAlbumArt: () => null,
}));

jest.mock('../components/MusicBlurBackground', () => ({
  MusicBlurBackground: () => null,
}));

jest.mock('../components/MusicSeekSlider', () => ({
  MusicSeekSlider: () => null,
}));

jest.mock('../components/MusicSharedElement', () => ({
  MusicSharedElement: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn(), goBack: jest.fn()}),
}));

jest.mock('react-navigation-shared-element', () => ({
  SharedElement: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({
      music: {
        songs: [
          {
            id: '1',
            title: 'Song 1',
            artist: 'Artist',
            album: 'Album',
            audioUrl: 'https://example.com/1.mp3',
            durationMs: 1000,
          },
        ],
        currentIndex: 0,
        playerState: 'playing',
        positionMs: 100,
        durationMs: 1000,
        isMuted: false,
      },
    }),
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    musicList: 'MusicList',
    musicNowPlaying: 'MusicNowPlaying',
  },
}));

describe('Music screens', () => {
  it('renders music list', () => {
    const navigation = {goBack: jest.fn(), navigate: jest.fn()};
    const tree = renderer
      .create(
        <MusicListScreen
          navigation={navigation as never}
          route={{key: 'k', name: 'MusicList', params: undefined}}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders now playing', () => {
    const navigation = {goBack: jest.fn(), navigate: jest.fn()};
    const tree = renderer
      .create(
        <MusicNowPlayingScreen
          navigation={navigation as never}
          route={{
            key: 'k',
            name: 'MusicNowPlaying',
            params: {trackId: '1'},
          }}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });
});
