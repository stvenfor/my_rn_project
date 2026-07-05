import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
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

export interface MusicCoverImageProps {
  song: LocalSong;
  size?: number;
  sharedElementId?: string;
  style?: StyleProp<ImageStyle>;
}

export function MusicCoverImage({
  song,
  size = musicTheme.albumArtSize,
  sharedElementId,
  style,
}: MusicCoverImageProps) {
  const elementId = sharedElementId ?? musicCoverSharedElementId(song.id);
  const imageStyle = [
    {width: size, height: size},
    styles.image,
    style,
  ] as StyleProp<ImageStyle>;

  let image: React.ReactNode;
  if (hasNetworkCover(song)) {
    image = (
      <Image
        source={{uri: song.albumArtUrl}}
        style={imageStyle}
        defaultSource={musicAssets.musicRecord}
      />
    );
  } else if (hasAssetCover(song)) {
    image = (
      <Image
        source={
          resolveAlbumArtAsset(musicAssets, song.albumArtAsset) ??
          musicAssets.musicRecord
        }
        style={imageStyle}
      />
    );
  } else {
    image = <Image source={musicAssets.musicRecord} style={imageStyle} />;
  }

  return (
    <MusicSharedElement id={elementId}>
      <View
        style={[
          styles.frame,
          {
            width: size,
            height: size,
            borderRadius: musicTheme.coverBorderRadius,
          },
          Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: musicTheme.coverElevation,
              shadowOffset: {width: 0, height: 2},
            },
            android: {elevation: musicTheme.coverElevation},
            default: {elevation: musicTheme.coverElevation},
          }),
        ]}>
        <View style={styles.clip}>{image}</View>
      </View>
    </MusicSharedElement>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'visible',
  },
  clip: {
    flex: 1,
    borderRadius: musicTheme.coverBorderRadius,
    overflow: 'hidden',
  },
  image: {
    borderRadius: musicTheme.coverBorderRadius,
  },
});
