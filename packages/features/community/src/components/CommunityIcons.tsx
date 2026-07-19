import React from 'react';
import {StyleSheet, View} from 'react-native';
import {communityTheme} from '../theme/communityTheme';

interface IconProps {
  color?: string;
  size?: number;
}

export function CommunityPlusIcon({color = '#FFFFFF', size = 20}: IconProps) {
  const bar = size * 0.55;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          position: 'absolute',
          width: bar,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 2.5,
          height: bar,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

export function CommunitySearchIcon({
  color = communityTheme.labelSecondary,
  size = 18,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.62,
          height: size * 0.62,
          borderRadius: size * 0.31,
          borderWidth: 2,
          borderColor: color,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.28,
          height: 2,
          backgroundColor: color,
          right: 0,
          bottom: size * 0.1,
          transform: [{rotate: '45deg'}],
        }}
      />
    </View>
  );
}

export function CommunityHeartIcon({
  color = communityTheme.actionColor,
  size = 20,
  filled = false,
}: IconProps & {filled?: boolean}) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.62,
          borderRadius: size * 0.2,
          borderWidth: filled ? 0 : 2,
          borderColor: color,
          backgroundColor: filled ? color : 'transparent',
          transform: [{rotate: '-45deg'}],
          marginTop: size * 0.08,
        }}
      />
    </View>
  );
}

export function CommunityCommentIcon({
  color = communityTheme.actionColor,
  size = 20,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.78,
          height: size * 0.55,
          borderRadius: size * 0.18,
          borderWidth: 2,
          borderColor: color,
        }}
      />
    </View>
  );
}

export function CommunityShareIcon({
  color = communityTheme.actionColor,
  size = 20,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.28,
          borderRightWidth: size * 0.28,
          borderBottomWidth: size * 0.32,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          marginBottom: 2,
        }}
      />
      <View
        style={{
          width: 2.5,
          height: size * 0.4,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function CommunityEllipsisIcon({
  color = communityTheme.actionColor,
  size = 20,
}: IconProps) {
  const dot = size * 0.16;
  return (
    <View style={[styles.ellipsis, {width: size, height: size}]}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: color,
            marginHorizontal: 1.5,
          }}
        />
      ))}
    </View>
  );
}

export function CommunityChatBubblesIcon({
  color = communityTheme.emptyIconColor,
  size = 56,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.4,
          borderRadius: 10,
          borderWidth: 2.5,
          borderColor: color,
          position: 'absolute',
          left: size * 0.08,
          top: size * 0.18,
        }}
      />
      <View
        style={{
          width: size * 0.5,
          height: size * 0.36,
          borderRadius: 10,
          borderWidth: 2.5,
          borderColor: color,
          position: 'absolute',
          right: size * 0.08,
          bottom: size * 0.14,
        }}
      />
    </View>
  );
}

export function CommunityWarningIcon({
  color = communityTheme.errorIconColor,
  size = 48,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderRadius: size * 0.39,
          borderWidth: 2.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 3,
            height: size * 0.28,
            backgroundColor: color,
            borderRadius: 1,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {alignItems: 'center', justifyContent: 'center'},
  ellipsis: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
