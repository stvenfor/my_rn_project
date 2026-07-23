import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';

type Props = {
  onAi?: () => void;
  onService?: () => void;
};

export function HxbFloatingActions({onAi, onService}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, {bottom: 64 + Math.max(insets.bottom, 8)}]}>
      <View style={styles.aiLabelWrap}>
        <Text style={styles.aiLabel}>AI 小助手</Text>
      </View>
      <Pressable style={styles.aiBtn} onPress={onAi}>
        <Text style={styles.aiEmoji}>🤖</Text>
      </Pressable>
      <Pressable style={styles.csBtn} onPress={onService}>
        <Text style={styles.csEmoji}>😊</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 12,
    alignItems: 'center',
  },
  aiLabelWrap: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
    ...t.shadow,
  },
  aiLabel: {
    fontSize: 10,
    color: t.primaryDeep,
    fontWeight: '700',
  },
  aiBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF7FF',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...t.shadow,
  },
  aiEmoji: {
    fontSize: 26,
  },
  csBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF7FF',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...t.shadow,
  },
  csEmoji: {
    fontSize: 22,
  },
});
