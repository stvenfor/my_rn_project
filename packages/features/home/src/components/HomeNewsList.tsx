import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {HomeNewsItem} from '../models/homeDashboardModel';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  items: HomeNewsItem[];
}

export function HomeNewsList({items}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>行业动态</Text>
      {items.map(item => (
        <View key={item.title} style={styles.card}>
          <View style={styles.content}>
            <Text style={styles.newsTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {item.source} {item.date}
            </Text>
          </View>
          {item.imageUrl ? (
            <Image source={{uri: item.imageUrl}} style={styles.thumb} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8},
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    backgroundColor: homeDashboardTheme.cardWhite,
    borderRadius: 14,
  },
  content: {flex: 1, marginRight: 12},
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: homeDashboardTheme.titleBlack,
    lineHeight: 20,
  },
  meta: {
    fontSize: 11,
    color: homeDashboardTheme.textGray,
    marginTop: 8,
  },
  thumb: {width: 96, height: 64, borderRadius: 8},
});
