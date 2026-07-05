import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {musicTheme} from '../theme/musicTheme';

export type MusicControlIcon =
  | 'skip_previous'
  | 'play_arrow'
  | 'pause'
  | 'skip_next';

const ICON_GLYPH: Record<MusicControlIcon, string> = {
  skip_previous: '⏮',
  play_arrow: '▶',
  pause: '⏸',
  skip_next: '⏭',
};

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
  return (
    <Pressable onPress={onPress} style={styles.hit} accessibilityRole="button">
      <Text
        style={[styles.icon, {fontSize: iconSize, lineHeight: iconSize + 4}]}>
        {ICON_GLYPH[icon]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    color: musicTheme.titleColor,
    textAlign: 'center',
  },
});
