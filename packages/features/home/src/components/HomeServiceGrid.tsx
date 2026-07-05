import React from 'react';
import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import type {HomeServiceItem} from '../models/homeDashboardModel';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  items: HomeServiceItem[];
}

export function HomeServiceGrid({items}: Props) {
  const {width} = useWindowDimensions();
  const cellWidth = (width - 32) / 4;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>服务推荐</Text>
      <View style={styles.grid}>
        {items.map(item => (
          <View key={item.label} style={[styles.cell, {width: cellWidth}]}>
            <View style={styles.iconWrap}>
              <View style={styles.iconBox}>
                {item.imageUrl ? (
                  <Image source={{uri: item.imageUrl}} style={styles.iconImg} />
                ) : (
                  <Text style={styles.emoji}>{item.emoji ?? '?'}</Text>
                )}
              </View>
              {item.badge ? (
                <View
                  style={[
                    styles.badge,
                    item.badge === '热门'
                      ? styles.badgeOrange
                      : styles.badgeBlue,
                  ]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingTop: 24},
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
    marginBottom: 12,
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  cell: {alignItems: 'center', marginBottom: 16},
  iconWrap: {width: 48, height: 48},
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: homeDashboardTheme.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {width: 48, height: 48, borderRadius: 14},
  emoji: {fontSize: 24},
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeOrange: {backgroundColor: homeDashboardTheme.badgeOrange},
  badgeBlue: {backgroundColor: homeDashboardTheme.badgeBlue},
  badgeText: {color: '#fff', fontSize: 9, fontWeight: '600'},
  label: {
    marginTop: 8,
    fontSize: 12,
    color: homeDashboardTheme.textDarkGray,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
