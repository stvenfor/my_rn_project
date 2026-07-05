import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function HomeSearchBar() {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.placeholder}>搜索客户、订单、资讯</Text>
      </View>
      <View style={styles.scanBtn}>
        <Text style={styles.scanIcon}>▣</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  searchIcon: {fontSize: 14, marginRight: 8, opacity: 0.7},
  placeholder: {fontSize: 14, color: 'rgba(255,255,255,0.6)'},
  scanBtn: {
    width: 40,
    height: 40,
    marginLeft: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {fontSize: 18, color: '#fff'},
});
