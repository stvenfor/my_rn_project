import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

type Props = {
  source: ImageSourcePropType;
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  duration?: string;
  badge?: string;
  style?: StyleProp<ViewStyle>;
};

export function DubbingCoverImage({
  source,
  width,
  height,
  borderRadius = 8,
  duration,
  badge,
  style,
}: Props) {
  const badgeColor =
    badge === 'AD' ? t.primaryGreen : badge ? '#FF6B35' : undefined;

  return (
    <View style={[styles.wrap, {width, height, borderRadius}, style]}>
      <Image source={source} style={styles.cover} resizeMode="cover" />
      {duration ? (
        <View style={styles.duration}>
          <Image
            source={dubbingHomeAssets.icon_play_badge}
            style={styles.playBadge}
          />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      ) : null}
      {badge && badgeColor ? (
        <View style={[styles.badge, {backgroundColor: badgeColor}]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {overflow: 'hidden', backgroundColor: t.searchFieldBackground},
  cover: {width: '100%', height: '100%'},
  duration: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  playBadge: {width: 10, height: 10},
  durationText: {marginLeft: 3, fontSize: 10, color: '#fff', lineHeight: 12},
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {fontSize: 10, color: '#fff', fontWeight: '600', lineHeight: 12},
});
