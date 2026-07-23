import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {HxbCourse} from '../../../data/rnLabHxbMockData';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbIconBox} from './HxbIcons';

type Props = {
  course: HxbCourse;
  onPress?: (key: string) => void;
};

export function HxbQuickActions({course, onPress}: Props) {
  const items = [
    {
      key: 'listen',
      label: `听课${course.listenProgress}%`,
      glyph: '🎧',
      bg: [t.green, t.greenDeep],
    },
    {
      key: 'practice',
      label: `练题${course.practiceProgress}%`,
      glyph: '✅',
      bg: [t.primary, t.primaryDeep],
    },
    {
      key: 'wrong',
      label: `错题${course.wrongCount}道`,
      glyph: '📕',
      bg: [t.orange, '#FF6A2A'],
      emphasize: true,
    },
    {
      key: 'qa',
      label: `答疑${course.qaCountLabel}`,
      glyph: '❓',
      bg: [t.cyan, '#2BB7E0'],
      badge: course.qaBadge,
    },
  ];

  return (
    <View style={styles.row}>
      {items.map(item => (
        <Pressable
          key={item.key}
          style={styles.item}
          onPress={() => onPress?.(item.key)}>
          <HxbIconBox bg={item.bg} glyph={item.glyph} badge={item.badge} />
          <Text
            style={[
              styles.label,
              item.emphasize ? styles.labelOrange : null,
            ]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 18,
    marginHorizontal: 8,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: t.text,
    fontWeight: '600',
  },
  labelOrange: {
    color: t.orange,
  },
});
