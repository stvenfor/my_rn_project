import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  greeting: string;
}

export function HomeGreetingSection({greeting}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.greeting}>{greeting}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>🔔</Text>
        <Text style={styles.badgeText}>3条新消息</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: homeDashboardTheme.messageBadgeBg,
    borderRadius: 12,
  },
  badgeIcon: {fontSize: 14, marginRight: 4},
  badgeText: {
    fontSize: 11,
    color: homeDashboardTheme.messageBadgeText,
    fontWeight: '500',
  },
});
