import React from 'react';
import {StyleSheet, View} from 'react-native';
import {communityTheme} from '../theme/communityTheme';

function Bone({
  width,
  height,
  circle = false,
}: {
  width: number | `${number}%`;
  height: number;
  circle?: boolean;
}) {
  return (
    <View style={[styles.bone, {width, height}, circle && styles.circle]} />
  );
}

function PostSkeletonItem() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Bone width={44} height={44} circle />
        <View style={styles.headerMeta}>
          <View style={styles.metaLine}>
            <Bone width={'100%'} height={14} />
          </View>
          <Bone width={120} height={12} />
        </View>
      </View>
      <Bone width={'100%'} height={14} />
      <View style={styles.gap8} />
      <Bone width={'100%'} height={14} />
      <View style={styles.gap8} />
      <Bone width={200} height={14} />
      <View style={styles.gap12} />
      <Bone width={'100%'} height={180} />
    </View>
  );
}

export function PostSkeletonList() {
  return (
    <View>
      {Array.from({length: communityTheme.skeletonCount}, (_, index) => (
        <View key={`skeleton-${index}`}>
          <PostSkeletonItem />
          {index < communityTheme.skeletonCount - 1 ? (
            <View style={styles.separator} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: communityTheme.surface,
    borderRadius: communityTheme.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: communityTheme.separator,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  headerMeta: {
    flex: 1,
    marginLeft: 12,
  },
  metaLine: {
    marginBottom: 8,
  },
  bone: {
    backgroundColor: communityTheme.fillSecondary,
    borderRadius: 4,
    marginBottom: 8,
  },
  circle: {
    borderRadius: 22,
    marginBottom: 0,
  },
  gap8: {
    height: 0,
  },
  gap12: {
    height: 4,
  },
  separator: {
    height: communityTheme.skeletonSeparator,
  },
});
