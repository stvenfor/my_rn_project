import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {checkInMallTheme} from '../theme/checkInMallTheme';

export function GiftSectionPlaceholder() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>i车币换礼</Text>
      <View style={styles.empty}>
        <Text style={styles.giftIcon}>🎁</Text>
        <Text style={styles.emptyText}>商城筹备中，礼品马上就到</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginHorizontal: 16, marginTop: 16, marginBottom: 24},
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: checkInMallTheme.textPrimary,
    marginBottom: 12,
  },
  empty: {alignItems: 'center', paddingVertical: 40},
  giftIcon: {fontSize: 64, opacity: 0.3},
  emptyText: {
    fontSize: 14,
    color: checkInMallTheme.textHint,
    marginTop: 16,
  },
});
