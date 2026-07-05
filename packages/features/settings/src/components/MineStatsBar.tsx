import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {MineStatModel} from '../models/mineStatModel';
import {mineLayout, mineTheme} from '../theme/mineTheme';

interface Props {
  stats: MineStatModel[];
}

export function MineStatsBar({stats}: Props) {
  return (
    <View style={styles.container}>
      {stats.map(stat => (
        <View key={stat.label} style={styles.cell}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: mineTheme.cardWhite,
    borderRadius: mineLayout.statsBarRadius,
    paddingVertical: 18,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: mineTheme.titleBlack,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: mineTheme.textGray600,
  },
});
