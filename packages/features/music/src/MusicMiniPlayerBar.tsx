import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {formatMusicDuration} from './utils/formatMusicDuration';
import {MusicCoverAvatar} from './components/MusicCoverAvatar';
import {
  selectCurrentSong,
  selectHasActiveSession,
  selectMusicDuration,
  selectMusicPlayerState,
  selectMusicPosition,
  stopPlayback,
  togglePlayPause,
  type MusicDispatch,
} from './musicSlice';
import {musicTheme} from './theme/musicTheme';

export function MusicMiniPlayerBar() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<MusicDispatch>();
  const visible = useSelector(selectHasActiveSession);
  const song = useSelector(selectCurrentSong);
  const playerState = useSelector(selectMusicPlayerState);
  const positionMs = useSelector(selectMusicPosition);
  const durationMs = useSelector(selectMusicDuration);

  if (!visible || !song) {
    return null;
  }

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;
  const playing = playerState === 'playing';

  return (
    <View
      style={[
        styles.wrap,
        Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: musicTheme.miniPlayerElevation,
            shadowOffset: {width: 0, height: -2},
          },
          android: {elevation: musicTheme.miniPlayerElevation},
          default: {elevation: musicTheme.miniPlayerElevation},
        }),
      ]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
      </View>
      <View style={styles.row}>
        <Pressable
          onPress={() => dispatch(togglePlayPause())}
          style={styles.artWrap}>
          <MusicCoverAvatar song={song} radius={musicTheme.miniCoverRadius} />
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.meta}
          onPress={() =>
            navigation.navigate(RoutePath.musicNowPlaying, {trackId: song.id})
          }>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {t('musicByArtist', {artist: song.artist})}
          </Text>
          {durationMs > 0 ? (
            <Text style={styles.time}>
              {formatMusicDuration(positionMs)} /{' '}
              {formatMusicDuration(durationMs)}
            </Text>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => dispatch(stopPlayback())}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel={t('musicClosePlayer')}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: musicTheme.miniPlayerBackground,
  },
  progressTrack: {
    height: 2,
    backgroundColor: musicTheme.miniPlayerProgressTrack,
  },
  progressFill: {
    height: 2,
    backgroundColor: musicTheme.miniPlayerProgressFill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: musicTheme.miniPlayerBarHeight - 2,
  },
  artWrap: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: musicTheme.playOverlay,
    borderRadius: musicTheme.miniCoverRadius,
  },
  playIcon: {
    color: musicTheme.titleColor,
    fontSize: 22,
  },
  meta: {flex: 1},
  title: {
    color: musicTheme.titleColor,
    fontWeight: '600',
    fontSize: 14,
  },
  artist: {
    color: musicTheme.subtitleColor,
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    color: musicTheme.timeMutedColor,
    fontSize: 11,
    marginTop: 2,
  },
  close: {padding: 8},
  closeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 22,
    lineHeight: 22,
  },
});
