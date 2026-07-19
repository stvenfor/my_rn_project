import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {musicTheme} from '../theme/musicTheme';
import {
  MusicPauseIcon,
  MusicPlayIcon,
  MusicSkipNextIcon,
  MusicSkipPreviousIcon,
} from './MusicIcons';

export type MusicControlIcon =
  | 'skip_previous'
  | 'play_arrow'
  | 'pause'
  | 'skip_next';

export interface MusicControlButtonProps {
  icon: MusicControlIcon;
  onPress: () => void;
  iconSize?: number;
}

export function MusicControlButton({
  icon,
  onPress,
  iconSize = musicTheme.controlIconSize,
}: MusicControlButtonProps) {
  let glyph: React.ReactNode;
  switch (icon) {
    case 'skip_previous':
      glyph = <MusicSkipPreviousIcon size={iconSize} />;
      break;
    case 'play_arrow':
      glyph = <MusicPlayIcon size={iconSize} />;
      break;
    case 'pause':
      glyph = <MusicPauseIcon size={iconSize} />;
      break;
    case 'skip_next':
      glyph = <MusicSkipNextIcon size={iconSize} />;
      break;
    default:
      glyph = null;
  }

  return (
    <Pressable onPress={onPress} style={styles.hit} accessibilityRole="button">
      {glyph}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
