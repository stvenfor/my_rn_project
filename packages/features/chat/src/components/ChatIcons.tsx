import React from 'react';
import {StyleSheet, View} from 'react-native';
import {chatTheme} from '../theme/chatTheme';

interface IconProps {
  color?: string;
  size?: number;
}

export function ChatSearchIcon({
  color = chatTheme.accent,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.searchRing,
          {
            width: size * 0.62,
            height: size * 0.62,
            borderRadius: size * 0.31,
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.searchHandle,
          {
            width: size * 0.28,
            height: 2,
            backgroundColor: color,
            right: size * 0.02,
            bottom: size * 0.12,
          },
        ]}
      />
    </View>
  );
}

export function ChatComposeIcon({
  color = chatTheme.accent,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.composePad,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: 3,
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.composeTip,
          {
            width: size * 0.22,
            height: 2.5,
            backgroundColor: color,
            top: size * 0.12,
            right: size * 0.08,
            transform: [{rotate: '-40deg'}],
          },
        ]}
      />
    </View>
  );
}

export function ChatBackIcon({color = chatTheme.accent, size = 24}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.chevron,
          {
            width: size * 0.42,
            height: size * 0.42,
            borderLeftWidth: 2.5,
            borderBottomWidth: 2.5,
            borderColor: color,
            transform: [{rotate: '45deg'}],
            marginLeft: size * 0.18,
          },
        ]}
      />
    </View>
  );
}

export function ChatEllipsisIcon({
  color = chatTheme.accent,
  size = 22,
}: IconProps) {
  const dot = size * 0.16;
  return (
    <View style={[styles.ellipsisRow, {width: size, height: size}]}>
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

export function ChatMicIcon({
  color = chatTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.micHead,
          {
            width: size * 0.34,
            height: size * 0.48,
            borderRadius: size * 0.17,
            backgroundColor: color,
            marginTop: size * 0.08,
          },
        ]}
      />
      <View
        style={[
          styles.micStem,
          {
            width: 2,
            height: size * 0.16,
            backgroundColor: color,
            marginTop: 1,
          },
        ]}
      />
      <View
        style={[
          styles.micBase,
          {
            width: size * 0.36,
            height: 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function ChatKeyboardIcon({
  color = chatTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.keyPad,
          {
            width: size * 0.84,
            height: size * 0.58,
            borderRadius: 3,
            borderColor: color,
          },
        ]}
      />
    </View>
  );
}

export function ChatSmileIcon({
  color = chatTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.smileRing,
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size * 0.39,
            borderColor: color,
          },
        ]}
      />
    </View>
  );
}

export function ChatPlusIcon({
  color = chatTheme.labelSecondary,
  size = 22,
}: IconProps) {
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

export function ChatSendArrowIcon({color = '#FFFFFF', size = 18}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.sendShaft,
          {
            width: 2.5,
            height: size * 0.55,
            backgroundColor: color,
            marginBottom: -2,
          },
        ]}
      />
      <View
        style={[
          styles.sendHead,
          {
            borderLeftWidth: size * 0.28,
            borderRightWidth: size * 0.28,
            borderBottomWidth: size * 0.32,
            borderBottomColor: color,
          },
        ]}
      />
    </View>
  );
}

export function ChatPhotoIcon({
  color = chatTheme.labelSecondary,
  size = 26,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.photoFrame,
          {
            width: size * 0.78,
            height: size * 0.62,
            borderRadius: 4,
            borderColor: color,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: size * 0.09,
          backgroundColor: color,
          top: size * 0.28,
          left: size * 0.28,
        }}
      />
    </View>
  );
}

export function ChatCameraIcon({
  color = chatTheme.labelSecondary,
  size = 26,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.camBody,
          {
            width: size * 0.78,
            height: size * 0.52,
            borderRadius: 4,
            borderColor: color,
            marginTop: size * 0.12,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.06,
          width: size * 0.28,
          height: size * 0.14,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRing: {
    borderWidth: 2,
    position: 'absolute',
    left: 1,
    top: 1,
  },
  searchHandle: {
    position: 'absolute',
    transform: [{rotate: '45deg'}],
  },
  composePad: {
    borderWidth: 2,
  },
  composeTip: {
    position: 'absolute',
  },
  chevron: {},
  ellipsisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micHead: {},
  micStem: {},
  micBase: {},
  keyPad: {
    borderWidth: 2,
  },
  smileRing: {
    borderWidth: 2,
  },
  sendShaft: {},
  sendHead: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  photoFrame: {
    borderWidth: 2,
  },
  camBody: {
    borderWidth: 2,
  },
});
