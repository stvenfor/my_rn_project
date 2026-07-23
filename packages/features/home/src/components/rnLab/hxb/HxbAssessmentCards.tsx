import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbGradient} from './HxbGradient';

type Props = {
  processScore: number;
  onProcessPress?: () => void;
  onSmartPress?: () => void;
};

export function HxbAssessmentCards({
  processScore,
  onProcessPress,
  onSmartPress,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onProcessPress}>
        <HxbGradient
          colors={[t.assessStart, t.assessEnd]}
          style={styles.processCard}
          horizontal={false}>
          <View style={styles.processLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.processTitle}>过程性考核</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Pressable style={styles.cta} onPress={onProcessPress}>
              <Text style={styles.ctaText}>去学习</Text>
            </Pressable>
            <Text style={styles.processSub}>
              当前课程过程性考核分数为 {processScore}分
            </Text>
          </View>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>👩‍💻</Text>
            <View style={styles.checklist}>
              <Text style={styles.checkItem}>✓</Text>
              <Text style={styles.checkItem}>✓</Text>
              <Text style={styles.checkItem}>✓</Text>
            </View>
          </View>
        </HxbGradient>
      </Pressable>

      <Pressable style={styles.smartCard} onPress={onSmartPress}>
        <View style={styles.smartHeader}>
          <Text style={styles.smartTitle}>智能学测</Text>
          <Text style={styles.chevronDark}>›</Text>
        </View>
        <View style={styles.chart}>
          <View style={[styles.wave, styles.wave1]} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={styles.chartLine} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  processCard: {
    borderRadius: t.cardRadius,
    minHeight: 118,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...t.shadow,
  },
  processLeft: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: t.text,
  },
  chevron: {
    fontSize: 18,
    color: t.textSecondary,
    marginLeft: 2,
  },
  cta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: t.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  processSub: {
    marginTop: 10,
    fontSize: 12,
    color: t.textSecondary,
  },
  illustration: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 42,
  },
  checklist: {
    position: 'absolute',
    right: 0,
    top: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  checkItem: {
    color: t.primary,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  smartCard: {
    marginTop: 12,
    backgroundColor: t.surface,
    borderRadius: t.cardRadius,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    overflow: 'hidden',
    ...t.shadow,
  },
  smartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: t.text,
  },
  chevronDark: {
    fontSize: 18,
    color: t.textSecondary,
    marginLeft: 2,
  },
  chart: {
    marginTop: 12,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#EAF6FF',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  wave: {
    position: 'absolute',
    left: -10,
    right: -10,
    height: 48,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: 'rgba(100,190,255,0.35)',
  },
  wave1: {
    bottom: 0,
  },
  wave2: {
    bottom: 10,
    backgroundColor: 'rgba(70,170,255,0.28)',
    transform: [{scaleX: 1.1}],
  },
  chartLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 28,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(47,123,255,0.35)',
  },
});
