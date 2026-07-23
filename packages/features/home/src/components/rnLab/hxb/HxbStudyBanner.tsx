import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbGradient} from './HxbGradient';

type Props = {
  hours: number;
  onPress?: () => void;
};

export function HxbStudyBanner({hours, onPress}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <HxbGradient
        colors={[t.bannerStart, t.bannerEnd]}
        style={styles.banner}>
        <View style={styles.leftIcon}>
          <Text style={styles.leftEmoji}>📱</Text>
        </View>
        <Text style={styles.text}>距离上次学习{hours}小时</Text>
        <View style={styles.right}>
          <View style={styles.dot} />
          <Text style={styles.action}>推送学习</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </HxbGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  banner: {
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  leftIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  leftEmoji: {
    fontSize: 16,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.danger,
    marginRight: 4,
  },
  action: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  chevron: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 2,
    marginTop: -1,
  },
});
