import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HXB_TABS} from '../../../data/rnLabHxbMockData';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbTabGlyph} from './HxbIcons';

type Props = {
  activeId: string;
  onChange: (id: string) => void;
};

export function HxbBottomTabBar({activeId, onChange}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 8)}]}>
      {HXB_TABS.map(tab => {
        const active = tab.id === activeId;
        return (
          <Pressable
            key={tab.id}
            style={styles.item}
            onPress={() => onChange(tab.id)}>
            <View>
              <HxbTabGlyph id={tab.id} active={active} />
              {'badge' in tab && tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: t.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingTop: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: '#9AA0A6',
    marginTop: 2,
  },
  labelActive: {
    color: t.primary,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -16,
    minWidth: 26,
    height: 16,
    borderRadius: 8,
    backgroundColor: t.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
