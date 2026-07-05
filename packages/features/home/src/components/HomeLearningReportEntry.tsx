import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  onPress: () => void;
}

export function HomeLearningReportEntry({onPress}: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <Text style={styles.emoji}>📊</Text>
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
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: homeDashboardTheme.cardWhite,
    borderRadius: 12,
  },
  emoji: {fontSize: 28},
  meta: {flex: 1, marginLeft: 12},
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: homeDashboardTheme.titleBlack,
  },
  subtitle: {
    fontSize: 12,
    color: homeDashboardTheme.textGray,
    marginTop: 2,
  },
  chevron: {fontSize: 22, color: homeDashboardTheme.textGray},
});
