import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  onPress: () => void;
}

export function HomeLearningReportEntry({onPress}: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.iconBox}>
        <Text style={styles.iconGlyph}>📈</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.title}>学习报告</Text>
        <Text style={styles.subtitle}>今日高光 · 学习记录</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {fontSize: 22},
  meta: {flex: 1, marginLeft: 12},
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: t.labelSecondary,
    marginTop: 2,
  },
  chevron: {fontSize: 22, color: t.labelTertiary},
});
