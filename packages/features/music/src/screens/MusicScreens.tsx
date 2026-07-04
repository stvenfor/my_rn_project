import React, {useEffect} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {formatDuration} from '@core/media-player';
import {
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';
import {musicAssets} from '../assets/musicAssets';
import {
  initMusicPlayer,
  playAt,
  playNext,
  playPrevious,
  seekTo,
  selectCurrentSong,
  selectMusicDuration,
  selectMusicPlayerState,
  selectMusicPosition,
  selectMusicSongs,
  toggleMute,
  togglePlayPause,
  type MusicDispatch,
} from '../musicSlice';

export function MusicListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.musicList>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<MusicDispatch>();
  const songs = useSelector(selectMusicSongs);

  useEffect(() => {
    dispatch(initMusicPlayer());
  }, [dispatch]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('musicPoc')} />
      <Text style={styles.hint}>{t('musicListHint')}</Text>
      {songs.map((track, index) => (
        <ListRow
          key={track.id}
          title={track.title}
          subtitle={track.artist}
          onPress={async () => {
            await dispatch(playAt(index));
            navigation.navigate(RoutePath.musicNowPlaying, {trackId: track.id});
          }}
        />
      ))}
    </ScreenContainer>
  );
}

export function MusicNowPlayingScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch<MusicDispatch>();
  const song = useSelector(selectCurrentSong);
  const playerState = useSelector(selectMusicPlayerState);
  const positionMs = useSelector(selectMusicPosition);
  const durationMs = useSelector(selectMusicDuration);
  const playing = playerState === 'playing';

  useEffect(() => {
    dispatch(initMusicPlayer());
  }, [dispatch]);

  if (!song) {
    return (
      <ScreenContainer>
        <SectionTitle title={t('musicNowPlaying')} />
        <Text style={styles.empty}>{t('musicNoTrack')}</Text>
      </ScreenContainer>
    );
  }

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={styles.darkScreen}>
      <ScrollView contentContainerStyle={styles.darkContent}>
        <View style={styles.artBox}>
          <Image source={musicAssets.lady} style={styles.largeArt} />
          <Image
            source={musicAssets.musicRecord}
            style={styles.recordOverlay}
          />
        </View>
        <Text style={styles.trackTitle}>{song.title}</Text>
        <Text style={styles.trackArtist}>{song.artist}</Text>
        <Text style={styles.trackAlbum}>{song.album}</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
        </View>
        <Text style={styles.timeText}>
          {formatDuration(positionMs)} / {formatDuration(durationMs)}
        </Text>

        <View style={styles.controls}>
          <Pressable onPress={() => dispatch(playPrevious())}>
            <Text style={styles.controlBtn}>⏮</Text>
          </Pressable>
          <Pressable onPress={() => dispatch(togglePlayPause())}>
            <Text style={styles.controlBtnMain}>{playing ? '❚❚' : '▶'}</Text>
          </Pressable>
          <Pressable onPress={() => dispatch(playNext())}>
            <Text style={styles.controlBtn}>⏭</Text>
          </Pressable>
        </View>

        <PrimaryButton
          title={t('musicSeekForward')}
          onPress={() =>
            dispatch(seekTo(Math.min(positionMs + 15000, durationMs)))
          }
        />
        <View style={styles.gap} />
        <PrimaryButton
          title={t('musicToggleMute')}
          onPress={() => dispatch(toggleMute())}
        />
        <Text style={styles.mockHint}>{t('musicMockPlayerHint')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {...typography.caption, color: colors.textSecondary, marginBottom: 12},
  empty: {...typography.body},
  darkScreen: {flex: 1, backgroundColor: colors.backgroundDark},
  darkContent: {padding: 20, alignItems: 'center'},
  artBox: {marginTop: 24, marginBottom: 24},
  largeArt: {width: 260, height: 260, borderRadius: 12},
  recordOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -20,
    right: -20,
  },
  trackTitle: {...typography.title, color: colors.onDark, textAlign: 'center'},
  trackArtist: {...typography.body, color: colors.overlayLight, marginTop: 8},
  trackAlbum: {...typography.caption, color: colors.overlayMuted, marginTop: 4},
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.overlayFaint,
    borderRadius: 2,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressFill: {height: 4, backgroundColor: colors.accentTeal},
  timeText: {...typography.caption, color: colors.overlayMuted, marginTop: 8},
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginVertical: 24,
  },
  controlBtn: {color: colors.onDark, fontSize: 28},
  controlBtnMain: {color: colors.onDark, fontSize: 42},
  gap: {height: 12},
  mockHint: {
    ...typography.caption,
    color: colors.overlaySubtle,
    marginTop: 20,
    textAlign: 'center',
  },
});
