import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  greeting: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: t.labelPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: t.messageBadgeBg,
    borderRadius: 20,
  },
  badgeIcon: {fontSize: 14, marginRight: 4, color: t.accent},
  badgeText: {
    fontSize: 12,
    color: t.accent,
    fontWeight: '500',
  },
});
