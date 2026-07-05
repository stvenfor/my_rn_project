import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {HomeQuickAction} from '../models/homeDashboardModel';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  actions: HomeQuickAction[];
}

export function HomeQuickActionGrid({actions}: Props) {
  return (
    <View style={styles.wrap}>
      {actions.map(action => (
        <View key={action.title} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.thumb}>
              {action.imageUrl ? (
                <Image
                  source={{uri: action.imageUrl}}
                  style={styles.thumbImg}
                />
              ) : (
                <Text style={styles.emoji}>{action.emoji ?? '?'}</Text>
              )}
            </View>
            <View style={styles.meta}>
              <Text style={styles.title} numberOfLines={1}>
                {action.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {action.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionBtn}>
              <Text style={styles.actionText}>{action.actionLabel}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: '47%',
    minHeight: 120,
    padding: 14,
    backgroundColor: homeDashboardTheme.cardWhite,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  topRow: {flexDirection: 'row', alignItems: 'center'},
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: homeDashboardTheme.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: {width: 40, height: 40, borderRadius: 10},
  emoji: {fontSize: 20},
  meta: {flex: 1, marginLeft: 10},
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: homeDashboardTheme.titleBlack,
  },
  subtitle: {fontSize: 11, color: homeDashboardTheme.textGray, marginTop: 2},
  actionRow: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8},
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(27,130,210,0.08)',
  },
  actionText: {
    fontSize: 12,
    color: homeDashboardTheme.primaryBlue,
    fontWeight: '500',
  },
});
