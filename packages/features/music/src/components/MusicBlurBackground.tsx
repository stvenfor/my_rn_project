import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {musicAssets} from '../assets/musicAssets';
import {
  hasAssetCover,
  hasNetworkCover,
  musicBackgroundSharedElementId,
  resolveAlbumArtAsset,
  type LocalSong,
} from '../models/localSong';
import {musicTheme} from '../theme/musicTheme';
import {supportsNativeBlur} from '../utils/nativeCapabilities';
import {MusicSharedElement} from './MusicSharedElement';

export interface MusicBlurBackgroundProps {
  song: LocalSong;
}

function BackgroundImage({song}: {song: LocalSong}) {
  if (hasNetworkCover(song)) {
    return (
      <Image
        source={{uri: song.albumArtUrl}}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        defaultSource={musicAssets.lady}
      />
    );
  }
  if (hasAssetCover(song)) {
    return (
      <Image
        source={
          resolveAlbumArtAsset(musicAssets, song.albumArtAsset) ??
          musicAssets.lady
        }
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    );
  }
  return (
    <Image
      source={musicAssets.lady}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />
  );
}

function BlurLayer() {
  if (supportsNativeBlur) {
    try {
      const {BlurView} = require('@react-native-community/blur') as {
        BlurView: React.ComponentType<{
          style?: object;
          blurType?: string;
          blurAmount?: number;
          reducedTransparencyFallbackColor?: string;
        }>;
      };
      return (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={musicTheme.blurAmount}
          reducedTransparencyFallbackColor="#000000"
        />
      );
    } catch {
      // Fall through to static overlay.
    }
  }
  return (
    <View
      style={[StyleSheet.absoluteFill, {backgroundColor: musicTheme.blurTint}]}
    />
  );
}

export function MusicBlurBackground({song}: MusicBlurBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <MusicSharedElement id={musicBackgroundSharedElementId(song.id)}>
        <View style={StyleSheet.absoluteFill}>
          <BackgroundImage song={song} />
        </View>
      </MusicSharedElement>
      <View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: musicTheme.blurOverlay},
        ]}
      />
      <BlurLayer />
      <View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: musicTheme.blurTint},
        ]}
      />
    </View>
  );
}
