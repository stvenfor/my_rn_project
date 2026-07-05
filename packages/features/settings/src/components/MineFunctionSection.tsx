import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {MineFunctionItem} from '../models/mineFunctionItem';
import {mineTheme} from '../theme/mineTheme';
import {MineReorderableFunctionGrid} from './MineReorderableFunctionGrid';

interface Props {
  items: MineFunctionItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onItemTap: (item: MineFunctionItem) => void;
  onDragActiveChange?: (active: boolean) => void;
}

export function MineFunctionSection({
  items,
  onReorder,
  onItemTap,
  onDragActiveChange,
}: Props) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>个人功能</Text>
        <Text style={styles.hint}>长按拖动顺序</Text>
      </View>
      <MineReorderableFunctionGrid
        items={items}
        onReorder={onReorder}
        onItemTap={onItemTap}
        onDragActiveChange={onDragActiveChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: mineTheme.titleBlack,
  },
  hint: {
    marginLeft: 'auto',
    fontSize: 12,
    color: mineTheme.textGray500,
  },
});
