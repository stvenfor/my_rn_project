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

interface Props {
  items: HomeFeatureItem[];
  onFeaturePress: (item: HomeFeatureItem) => void;
}

export function HomeFeatureGrid({items, onFeaturePress}: Props) {
  const {width} = useWindowDimensions();
  const cellWidth = (width - 16) / 5;

  return (
    <View style={styles.wrap}>
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
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 0,
  },
  cell: {alignItems: 'center', marginBottom: 12},
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {width: 48, height: 48, borderRadius: 14},
  emoji: {fontSize: 24},
  label: {
    marginTop: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});
