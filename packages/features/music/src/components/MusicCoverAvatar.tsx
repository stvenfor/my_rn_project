import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {MusicSharedElement} from './MusicSharedElement';
import {musicAssets} from '../assets/musicAssets';
import {
  hasAssetCover,
  hasNetworkCover,
  musicCoverSharedElementId,
  resolveAlbumArtAsset,
  type LocalSong,
} from '../models/localSong';
import {musicTheme} from '../theme/musicTheme';

export interface MusicCoverAvatarProps {
  song: LocalSong;
  radius?: number;
  sharedElementId?: string;
}

export function MusicCoverAvatar({
  song,
  radius = musicTheme.listCoverRadius,
  sharedElementId,
}: MusicCoverAvatarProps) {
  const size = radius * 2;
  const elementId = sharedElementId ?? musicCoverSharedElementId(song.id);

  let content: React.ReactNode;
  if (hasNetworkCover(song)) {
    content = (
      <Image
        source={{uri: song.albumArtUrl}}
        style={[
          styles.circle,
          {width: size, height: size, borderRadius: radius},
        ]}
      />
    );
  } else if (hasAssetCover(song)) {
    const asset =
      resolveAlbumArtAsset(musicAssets, song.albumArtAsset) ??
      musicAssets.musicRecord;
    content = (
      <Image
        source={asset}
        style={[
          styles.circle,
          {width: size, height: size, borderRadius: radius},
        ]}
      />
    );
  } else {
    content = (
      <View
        style={[
          styles.circle,
          styles.placeholder,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: song.accentColor ?? musicTheme.placeholderGreyDark,
          },
        ]}>
        <Text style={[styles.playGlyph, {fontSize: radius}]}>▶</Text>
      </View>
    );
  }

  return (
    <MusicSharedElement id={elementId}>
      <View style={{width: size, height: size}}>{content}</View>
    </MusicSharedElement>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: {
    color: 'rgba(255,255,255,0.9)',
    lineHeight: undefined,
  },
});
