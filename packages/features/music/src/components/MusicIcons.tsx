import React from 'react';
import {StyleSheet, View} from 'react-native';
import {musicTheme} from '../theme/musicTheme';

interface IconProps {
  color?: string;
  size?: number;
}

/** Material-like transport icons (parity with Flutter Icons.*). */
export function MusicSkipPreviousIcon({
  color = musicTheme.titleColor,
  size = 50,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.bar,
          {height: size * 0.42, backgroundColor: color, marginRight: 2},
        ]}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size * 0.22,
          borderBottomWidth: size * 0.22,
          borderRightWidth: size * 0.32,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: color,
        }}
      />
    </View>
  );
}

export function MusicSkipNextIcon({
  color = musicTheme.titleColor,
  size = 50,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size * 0.22,
          borderBottomWidth: size * 0.22,
          borderLeftWidth: size * 0.32,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: color,
        }}
      />
      <View
        style={[
          styles.bar,
          {height: size * 0.42, backgroundColor: color, marginLeft: 2},
        ]}
      />
    </View>
  );
}

export function MusicPlayIcon({
  color = musicTheme.titleColor,
  size = 50,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 0,
          height: 0,
          marginLeft: size * 0.08,
          borderTopWidth: size * 0.22,
          borderBottomWidth: size * 0.22,
          borderLeftWidth: size * 0.36,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: color,
        }}
      />
    </View>
  );
}

export function MusicPauseIcon({
  color = musicTheme.titleColor,
  size = 50,
}: IconProps) {
  const barW = Math.max(4, size * 0.14);
  const barH = size * 0.44;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: barW,
          height: barH,
          backgroundColor: color,
          borderRadius: 1,
          marginRight: size * 0.1,
        }}
      />
      <View
        style={{
          width: barW,
          height: barH,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

export function MusicShuffleIcon({
  color = musicTheme.fabIconColor,
  size = 24,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.72,
          height: 2.5,
          backgroundColor: color,
          transform: [{rotate: '-28deg'}],
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: size * 0.72,
          height: 2.5,
          backgroundColor: color,
          transform: [{rotate: '28deg'}],
          position: 'absolute',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderBottomWidth: 7,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          transform: [{rotate: '45deg'}],
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 7,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          transform: [{rotate: '-45deg'}],
        }}
      />
    </View>
  );
}

export function MusicHeadsetIcon({
  color = musicTheme.artistMutedColor,
  size = 28,
  off = false,
}: IconProps & {off?: boolean}) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.45,
          borderTopLeftRadius: size * 0.36,
          borderTopRightRadius: size * 0.36,
          borderWidth: 2.5,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
      <View style={{flexDirection: 'row', width: size * 0.78, marginTop: -2}}>
        <View
          style={{
            width: size * 0.22,
            height: size * 0.28,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
        <View style={{flex: 1}} />
        <View
          style={{
            width: size * 0.22,
            height: size * 0.28,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
      </View>
      {off ? (
        <View
          style={{
            position: 'absolute',
            width: size * 0.9,
            height: 2.5,
            backgroundColor: color,
            transform: [{rotate: '-35deg'}],
          }}
        />
      ) : null}
    </View>
  );
}

export function MusicCloseIcon({
  color = 'rgba(255,255,255,0.7)',
  size = 22,
}: IconProps) {
  const len = size * 0.7;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          position: 'absolute',
          width: len,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{rotate: '45deg'}],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: len,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{rotate: '-45deg'}],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
});
