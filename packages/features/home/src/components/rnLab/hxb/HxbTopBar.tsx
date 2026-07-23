import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';

type Props = {
  onScan?: () => void;
  onSearch?: () => void;
};

export function HxbTopBar({onScan, onSearch}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, {paddingTop: Math.max(insets.top, 12)}]}>
      <View style={styles.row}>
        <Pressable style={styles.side} onPress={onScan} hitSlop={8}>
          <View style={styles.scan}>
            <View style={[styles.scanCorner, styles.tl]} />
            <View style={[styles.scanCorner, styles.tr]} />
            <View style={[styles.scanCorner, styles.bl]} />
            <View style={[styles.scanCorner, styles.br]} />
            <View style={styles.scanLine} />
          </View>
        </Pressable>
        <Text style={styles.title}>汇学邦</Text>
        <Pressable style={styles.side} onPress={onSearch} hitSlop={8}>
          <View style={styles.search}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: t.bg,
    paddingBottom: 4,
  },
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  side: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: t.text,
  },
  scan: {
    width: 22,
    height: 22,
  },
  scanCorner: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderColor: t.text,
  },
  tl: {top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2},
  tr: {top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2},
  bl: {bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2},
  br: {bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2},
  scanLine: {
    position: 'absolute',
    left: 3,
    right: 3,
    top: 10,
    height: 2,
    backgroundColor: t.text,
  },
  search: {
    width: 22,
    height: 22,
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: t.text,
  },
  searchHandle: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: t.text,
    right: 1,
    bottom: 3,
    transform: [{rotate: '45deg'}],
  },
});
