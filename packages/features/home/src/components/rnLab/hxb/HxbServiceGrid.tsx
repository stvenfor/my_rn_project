import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {HXB_SERVICES} from '../../../data/rnLabHxbMockData';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbServiceGlyph} from './HxbIcons';

type Props = {
  onPress?: (id: string) => void;
};

export function HxbServiceGrid({onPress}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        {HXB_SERVICES.map(item => (
          <Pressable
            key={item.id}
            style={styles.cell}
            onPress={() => onPress?.(item.id)}>
            <View style={styles.cellText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text
                style={[
                  styles.subtitle,
                  item.tone === 'live' ? styles.liveSub : null,
                ]}>
                {item.subtitle}
              </Text>
            </View>
            <HxbServiceGlyph tone={item.tone} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: t.surface,
    borderRadius: t.cardRadius,
    paddingVertical: 6,
    paddingHorizontal: 6,
    ...t.shadow,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  cellText: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: t.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: t.textSecondary,
  },
  liveSub: {
    color: t.orange,
    fontWeight: '600',
  },
});
