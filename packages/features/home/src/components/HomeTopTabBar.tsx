import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TOP_TABS} from '../store/homeSlice';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  selectedIndex: number;
  onSelected: (index: number) => void;
}

export function HomeTopTabBar({selectedIndex, onSelected}: Props) {
  return (
    <View style={styles.wrap}>
      {TOP_TABS.map((label, index) => {
        const active = index === selectedIndex;
        return (
          <Pressable
            key={label}
            style={[styles.item, index < TOP_TABS.length - 1 && styles.gap]}
            onPress={() => onSelected(index)}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
            <View
              style={[styles.indicator, active && styles.indicatorActive]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  item: {alignItems: 'center'},
  gap: {marginRight: 24},
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: t.labelSecondary,
  },
  labelActive: {
    fontSize: 17,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  indicator: {
    marginTop: 6,
    width: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: t.accent,
  },
  indicatorActive: {width: 20},
});
