import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

interface Props {
  onSearchPress: () => void;
  onScanPress?: () => void;
}

export function HomeSearchBar({onSearchPress, onScanPress}: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.searchBox} onPress={onSearchPress}>
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.placeholder}>搜索客户、订单、资讯</Text>
      </Pressable>
      <Pressable style={styles.scanBtn} onPress={onScanPress}>
        <Text style={styles.scanIcon}>▣</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBox: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: 0.5,
    borderColor: t.separator,
  },
  searchIcon: {fontSize: 18, marginRight: 8, color: t.labelSecondary},
  placeholder: {fontSize: 15, color: t.labelTertiary},
  scanBtn: {
    width: 44,
    height: 44,
    marginLeft: 12,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {fontSize: 18, color: t.accent},
});
