import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

export function DealInvoiceEmptyState({onUpload}: {onUpload: () => void}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🧾</Text>
      <Text style={styles.hint}>还没有上传过成交发票，去上传第一张吧~</Text>
      <Pressable style={styles.btn} onPress={onUpload}>
        <Text style={styles.btnIcon}>＋</Text>
        <Text style={styles.btnText}>上传成交发票</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 320,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 72,
    opacity: 0.35,
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 21,
  },
  btn: {
    marginTop: 28,
    width: '100%',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B8CFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 4,
    marginTop: -1,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
