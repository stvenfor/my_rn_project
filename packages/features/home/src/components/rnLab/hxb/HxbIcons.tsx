import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';

export function HxbIconBox({
  bg,
  glyph,
  badge,
}: {
  bg: string[];
  glyph: string;
  badge?: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.box, {backgroundColor: bg[0]}]}>
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: bg[1] ?? bg[0],
              opacity: 0.45,
              left: '35%',
            },
          ]}
        />
        <Text style={styles.glyph}>{glyph}</Text>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function HxbServiceGlyph({
  tone,
}: {
  tone: 'blue' | 'live' | 'cyan' | 'indigo';
}) {
  const color =
    tone === 'live'
      ? t.orange
      : tone === 'cyan'
        ? t.cyan
        : tone === 'indigo'
          ? '#5B7CFF'
          : t.primaryDeep;
  const glyph =
    tone === 'live' ? '📺' : tone === 'cyan' ? '💧' : tone === 'indigo' ? '🖥️' : '🎯';
  return (
    <View style={[styles.serviceGlyph, {backgroundColor: `${color}22`}]}>
      <Text style={styles.serviceEmoji}>{glyph}</Text>
      {tone === 'live' ? (
        <View style={styles.liveBars}>
          <View style={[styles.bar, {height: 6}]} />
          <View style={[styles.bar, {height: 10}]} />
          <View style={[styles.bar, {height: 7}]} />
        </View>
      ) : null}
    </View>
  );
}

export function HxbTabGlyph({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const color = active ? t.primary : '#9AA0A6';
  const map: Record<string, string> = {
    study: '📂',
    message: '💬',
    store: '⬜',
    mine: '👤',
  };
  return <Text style={[styles.tabGlyph, {color}]}>{map[id] ?? '•'}</Text>;
}

const styles = StyleSheet.create({
  wrap: {
    width: 52,
    height: 52,
  },
  box: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glyph: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 28,
    height: 18,
    borderRadius: 9,
    backgroundColor: t.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  serviceGlyph: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: {
    fontSize: 22,
  },
  liveBars: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
    backgroundColor: t.orange,
  },
  tabGlyph: {
    fontSize: 20,
    marginBottom: 2,
  },
});
