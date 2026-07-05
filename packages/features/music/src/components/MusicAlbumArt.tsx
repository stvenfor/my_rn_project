import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {MusicCoverImage} from './MusicCoverImage';
import {musicTheme} from '../theme/musicTheme';
import type {LocalSong} from '../models/localSong';

export interface MusicAlbumArtProps {
  song: LocalSong;
  positionMs: number;
  durationMs: number;
}

export function MusicAlbumArt({
  song,
  positionMs,
  durationMs,
}: MusicAlbumArtProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const progress =
    durationMs > 0 ? Math.min(Math.max(positionMs / durationMs, 0), 1) : 0;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 35,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View
      style={{
        transform: [{scale}],
        width: musicTheme.albumArtSize,
        height: musicTheme.albumArtSize,
      }}>
      <View style={styles.stack}>
        <MusicCoverImage song={song} />
        <View style={styles.progressTrack}>
          <View style={[styles.progressBase, styles.progressFillBase]} />
          <View
            style={[
              styles.progressBase,
              styles.progressFillActive,
              {width: `${progress * 100}%`},
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: musicTheme.albumArtSize,
    height: musicTheme.albumArtSize,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    borderRadius: musicTheme.coverBorderRadius,
    overflow: 'hidden',
  },
  progressBase: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 4,
  },
  progressFillBase: {
    right: 0,
    backgroundColor: musicTheme.titleColor,
  },
  progressFillActive: {
    backgroundColor: musicTheme.nowPlayingBackground,
  },
});
