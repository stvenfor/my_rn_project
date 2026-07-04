import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {formatDuration} from '@core/media-player';
import {colors} from '@ui/design-system';
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
    <View style={styles.wrap}>
      <View style={[styles.progress, {width: `${progress * 100}%`}]} />
      <View style={styles.row}>
        <Pressable
          onPress={() => dispatch(togglePlayPause())}
          style={styles.artWrap}>
          {song.albumArtUrl ? (
            <Image source={{uri: song.albumArtUrl}} style={styles.art} />
          ) : (
            <View
              style={[
                styles.art,
                {backgroundColor: song.accentColor ?? colors.surfaceElevated},
              ]}
            />
          )}
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
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
              {formatDuration(positionMs)} / {formatDuration(durationMs)}
            </Text>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => dispatch(stopPlayback())}
          style={styles.close}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceDark,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceElevated,
  },
  progress: {
    height: 2,
    backgroundColor: colors.accentTeal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  artWrap: {width: 44, height: 44, marginRight: 12},
  art: {width: 44, height: 44, borderRadius: 22},
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlayDark,
    borderRadius: 22,
  },
  playIcon: {color: colors.onDark, fontSize: 14},
  meta: {flex: 1},
  title: {color: colors.onDark, fontWeight: '600', fontSize: 14},
  artist: {color: colors.overlayLight, fontSize: 12, marginTop: 2},
  time: {color: colors.overlayMuted, fontSize: 11, marginTop: 2},
  close: {padding: 8},
  closeText: {color: colors.overlayLight, fontSize: 22, lineHeight: 22},
});
