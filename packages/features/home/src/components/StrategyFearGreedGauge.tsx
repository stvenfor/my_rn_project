import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

/**
 * Visual stand-in for Flutter `_GaugePainter` semi-circle (green→yellow→red).
 * Uses layered arcs so we don't require react-native-svg.
 */
export function StrategyFearGreedGauge({label = '63 中立'}: {label?: string}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.arcTrack}>
        <View style={[styles.segment, styles.segGreen]} />
        <View style={[styles.segment, styles.segYellow]} />
        <View style={[styles.segment, styles.segRed]} />
        <View style={styles.mask} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const ARC_SIZE = 88;
const STROKE = 8;

const styles = StyleSheet.create({
  wrap: {
    width: ARC_SIZE,
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcTrack: {
    width: ARC_SIZE,
    height: ARC_SIZE / 2,
    borderTopLeftRadius: ARC_SIZE / 2,
    borderTopRightRadius: ARC_SIZE / 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    height: '100%',
  },
  segGreen: {backgroundColor: '#34C759'},
  segYellow: {backgroundColor: '#FFCC00'},
  segRed: {backgroundColor: '#FF3B30'},
  mask: {
    position: 'absolute',
    left: STROKE,
    right: STROKE,
    bottom: 0,
    height: ARC_SIZE / 2 - STROKE,
    borderTopLeftRadius: ARC_SIZE / 2 - STROKE,
    borderTopRightRadius: ARC_SIZE / 2 - STROKE,
    backgroundColor: t.surface,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: t.labelPrimary,
  },
});
