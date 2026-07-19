import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {MusicAlbumArt} from '../components/MusicAlbumArt';
import {MusicBlurBackground} from '../components/MusicBlurBackground';
import {MusicControlButton} from '../components/MusicControlButton';
import {MusicHeadsetIcon} from '../components/MusicIcons';
import {MusicSeekSlider} from '../components/MusicSeekSlider';
import {
  formatMusicDuration,
  initMusicPlayer,
  playNext,
  playPrevious,
  seekTo,
  selectCurrentSong,
  selectMusicDuration,
  selectMusicIsMuted,
  selectMusicPlayerState,
  selectMusicPosition,
  setPosition,
  toggleMute,
  togglePlayPause,
  type MusicDispatch,
} from '../musicSlice';
import {musicTheme} from '../theme/musicTheme';

/** Flutter hardcodes English title. */
const NOW_PLAYING_TITLE = 'Now Playing';

export function MusicNowPlayingScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.musicNowPlaying>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<MusicDispatch>();
  const song = useSelector(selectCurrentSong);
  const playerState = useSelector(selectMusicPlayerState);
  const positionMs = useSelector(selectMusicPosition);
  const durationMs = useSelector(selectMusicDuration);
  const isMuted = useSelector(selectMusicIsMuted);
  const playing = playerState === 'playing';

  React.useEffect(() => {
    dispatch(initMusicPlayer());
  }, [dispatch]);

  const navBar = (
    <AppNavBar
      title={NOW_PLAYING_TITLE}
      style="dark"
      backgroundColor={musicTheme.nowPlayingBackground}
      showBackButton
      onBack={() => navigation.goBack()}
    />
  );

  const handleSeekComplete = useCallback(
    (value: number) => {
      dispatch(seekTo(value));
    },
    [dispatch],
  );

  const handleSeekChange = useCallback(
    (value: number) => {
      dispatch(setPosition(value));
    },
    [dispatch],
  );

  if (!song) {
    return (
      <AppPageScaffold
        backgroundColor={musicTheme.nowPlayingBackground}
        navBar={navBar}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>{t('musicNoTrack')}</Text>
        </View>
      </AppPageScaffold>
    );
  }

  return (
    <AppPageScaffold
      layout="edgeToEdge"
      backgroundColor={musicTheme.nowPlayingBackground}>
      <View style={styles.root}>
        <MusicBlurBackground song={song} />
        <View style={styles.content}>
          <AppNavBar
            title={NOW_PLAYING_TITLE}
            style="dark"
            backgroundColor={musicTheme.nowPlayingBackground}
            showBackButton
            onBack={() => navigation.goBack()}
          />
          <View style={styles.center}>
            <MusicAlbumArt
              song={song}
              positionMs={positionMs}
              durationMs={durationMs}
            />
            <View style={styles.controls}>
              <Text style={styles.trackTitle}>{song.title}</Text>
              <Text style={styles.trackArtist}>{song.artist}</Text>
              <View style={styles.transport}>
                <MusicControlButton
                  icon="skip_previous"
                  onPress={() => dispatch(playPrevious())}
                />
                <MusicControlButton
                  icon={playing ? 'pause' : 'play_arrow'}
                  onPress={() => dispatch(togglePlayPause())}
                />
                <MusicControlButton
                  icon="skip_next"
                  onPress={() => dispatch(playNext())}
                />
              </View>
              {durationMs > 0 ? (
                <View style={styles.sliderBlock}>
                  <MusicSeekSlider
                    value={Math.min(positionMs, durationMs)}
                    maximumValue={durationMs}
                    onValueChange={handleSeekChange}
                    onSlidingComplete={handleSeekComplete}
                  />
                  <Text style={styles.timeText}>
                    {formatMusicDuration(positionMs)} /{' '}
                    {formatMusicDuration(durationMs)}
                  </Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => dispatch(toggleMute())}
                style={styles.muteButton}
                accessibilityRole="button"
                accessibilityLabel={t('musicToggleMute')}>
                <MusicHeadsetIcon off={isMuted} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: musicTheme.nowPlayingBackground,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  trackTitle: {
    color: musicTheme.titleColor,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  trackArtist: {
    color: musicTheme.artistMutedColor,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sliderBlock: {
    width: '100%',
    marginTop: 8,
  },
  timeText: {
    color: musicTheme.titleColor,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  muteButton: {
    marginTop: 20,
    padding: 8,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: musicTheme.titleColor,
    fontSize: 16,
  },
});
