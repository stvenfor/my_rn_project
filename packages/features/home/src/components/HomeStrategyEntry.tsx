import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  onPress: () => void;
}

export function HomeStrategyEntry({onPress}: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>▦</Text>
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>投资策略</Text>
          <Text style={styles.subtitle}>资产九宫格 · 恐贪定投 · 趋势策略</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingTop: 16},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: 0.5,
    borderColor: t.separator,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 20, color: t.accent},
  textCol: {flex: 1, marginLeft: 12},
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
