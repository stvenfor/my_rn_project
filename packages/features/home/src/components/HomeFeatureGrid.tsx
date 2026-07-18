import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {homeServiceIcons, type HomeServiceIconKey} from '../assets/homeAssets';
import type {HomeFeatureItem} from '../models/homeDashboardModel';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  items: HomeFeatureItem[];
  onFeaturePress: (item: HomeFeatureItem) => void;
}

function resolveIconSource(item: HomeFeatureItem): ImageSourcePropType | null {
  if (item.iconKey && item.iconKey in homeServiceIcons) {
    return homeServiceIcons[item.iconKey as HomeServiceIconKey];
  }
  if (item.imageUrl) {
    return {uri: item.imageUrl};
  }
  return null;
}

export function HomeFeatureGrid({items, onFeaturePress}: Props) {
  return (
    <View style={styles.card}>
      {items.map(item => {
        const source = resolveIconSource(item);
        return (
          <Pressable
            key={item.label}
            style={styles.cell}
            onPress={() => onFeaturePress(item)}>
            <View style={styles.iconBox}>
              {source ? (
                <Image source={source} style={styles.iconImage} />
              ) : (
                <Text style={styles.emoji}>{item.emoji ?? '?'}</Text>
              )}
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 4,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...t.cardShadow,
  },
  /** Flutter GridView crossAxisCount: 5 — percent width avoids screen-width miscalc → 4-col wrap */
  cell: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: t.fillSecondary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {width: 48, height: 48, borderRadius: 12},
  emoji: {fontSize: 24},
  label: {
    marginTop: 6,
    fontSize: 11,
    color: t.labelPrimary,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});
