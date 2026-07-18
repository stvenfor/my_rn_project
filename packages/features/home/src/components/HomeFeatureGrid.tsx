import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type {HomeFeatureItem} from '../models/homeDashboardModel';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  items: HomeFeatureItem[];
  onFeaturePress: (item: HomeFeatureItem) => void;
}

export function HomeFeatureGrid({items, onFeaturePress}: Props) {
  const {width} = useWindowDimensions();
  const cellWidth = (width - 32 - 16) / 5;

  return (
    <View style={styles.card}>
      {items.map(item => (
        <Pressable
          key={item.label}
          style={[styles.cell, {width: cellWidth}]}
          onPress={() => onFeaturePress(item)}>
          <View style={styles.iconBox}>
            {item.imageUrl ? (
              <Image source={{uri: item.imageUrl}} style={styles.iconImage} />
            ) : (
              <Text style={styles.emoji}>{item.emoji ?? '?'}</Text>
            )}
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {alignItems: 'center', marginBottom: 12},
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
