import React from 'react';
import {StyleSheet, View} from 'react-native';
import {authTheme} from '../theme/authTheme';

interface IconProps {
  color?: string;
  size?: number;
}

/** Lightweight vector-free icons matching Flutter Material/Cupertino prefixes. */
export function AuthMailIcon({
  color = authTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.mailBody,
          {
            width: size * 0.82,
            height: size * 0.58,
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mailFlap,
          {
            borderTopColor: color,
            borderLeftWidth: size * 0.41,
            borderRightWidth: size * 0.41,
            borderTopWidth: size * 0.28,
            marginTop: -size * 0.5,
          },
        ]}
      />
    </View>
  );
}

export function AuthLockIcon({
  color = authTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.lockShackle,
          {
            width: size * 0.42,
            height: size * 0.32,
            borderColor: color,
            borderRadius: size * 0.21,
            marginBottom: -2,
          },
        ]}
      />
      <View
        style={[
          styles.lockBody,
          {
            width: size * 0.58,
            height: size * 0.42,
            borderRadius: 3,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function AuthPhoneIcon({
  color = authTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.phoneBody,
          {
            width: size * 0.48,
            height: size * 0.82,
            borderColor: color,
            borderRadius: size * 0.1,
          },
        ]}
      />
    </View>
  );
}

export function AuthSmsIcon({
  color = authTheme.labelSecondary,
  size = 22,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.smsBubble,
          {
            width: size * 0.78,
            height: size * 0.55,
            borderColor: color,
            borderRadius: 4,
          },
        ]}
      />
    </View>
  );
}

export function AuthCheckIcon({color = '#FFFFFF', size = 14}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.checkArm,
          {
            width: size * 0.55,
            height: size * 0.28,
            borderBottomColor: color,
            borderLeftColor: color,
            transform: [{rotate: '-45deg'}],
            marginTop: -size * 0.08,
          },
        ]}
      />
    </View>
  );
}

export function AuthBackChevron({
  color = authTheme.accent,
  size = 24,
}: IconProps) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.chevron,
          {
            width: size * 0.42,
            height: size * 0.42,
            borderLeftColor: color,
            borderBottomColor: color,
            transform: [{rotate: '45deg'}],
            marginLeft: size * 0.18,
          },
        ]}
      />
    </View>
  );
}

export function AuthEyeIcon({
  color = authTheme.labelSecondary,
  size = 20,
  crossed = false,
}: IconProps & {crossed?: boolean}) {
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.eyeOuter,
          {
            width: size * 0.78,
            height: size * 0.48,
            borderColor: color,
            borderRadius: size,
          },
        ]}
      />
      <View
        style={[
          styles.eyePupil,
          {
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size,
            backgroundColor: color,
            marginTop: -size * 0.35,
          },
        ]}
      />
      {crossed ? (
        <View
          style={[
            styles.eyeSlash,
            {
              width: size * 0.9,
              height: 1.5,
              backgroundColor: color,
              transform: [{rotate: '-45deg'}],
              marginTop: -size * 0.35,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailBody: {
    borderWidth: 1.5,
    borderRadius: 2,
  },
  mailFlap: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  lockShackle: {
    borderWidth: 2,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  lockBody: {},
  phoneBody: {
    borderWidth: 1.5,
  },
  smsBubble: {
    borderWidth: 1.5,
  },
  checkArm: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    backgroundColor: 'transparent',
  },
  chevron: {
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    backgroundColor: 'transparent',
  },
  eyeOuter: {
    borderWidth: 1.5,
  },
  eyePupil: {},
  eyeSlash: {},
});
