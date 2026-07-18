import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {AuthCredentialMode} from '../models/authCredentialMode';
import {authTheme} from '../theme/authTheme';

interface AuthSegmentedControlProps {
  value: AuthCredentialMode | string;
  onChange: (mode: AuthCredentialMode | string) => void;
  segments: Array<{value: string; label: string}>;
}

/** CupertinoSlidingSegmentedControl-style switcher. */
export function AuthSegmentedControl({
  value,
  onChange,
  segments,
}: AuthSegmentedControlProps) {
  return (
    <View style={styles.root}>
      <View style={styles.track}>
        {segments.map(segment => {
          const selected = segment.value === value;
          return (
            <Pressable
              key={segment.value}
              accessibilityRole="button"
              onPress={() => onChange(segment.value)}
              style={[styles.segment, selected && styles.segmentSelected]}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {segment.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const LOGIN_SEGMENTS: Array<{value: AuthCredentialMode; label: string}> =
  [
    {value: 'email', label: '邮箱登录'},
    {value: 'phone', label: '短信登录'},
  ];

export const REGISTER_SEGMENTS = [
  {value: 'email', label: '邮箱注册'},
  {value: 'phone', label: '手机注册'},
] as const;

const styles = StyleSheet.create({
  root: {
    backgroundColor: authTheme.fillSecondary,
    borderRadius: authTheme.radiusMd,
    padding: 4,
  },
  track: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: authTheme.radiusMd - 2,
  },
  segmentSelected: {
    backgroundColor: authTheme.surface,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: authTheme.labelPrimary,
  },
  labelSelected: {
    fontWeight: '500',
    color: authTheme.labelPrimary,
  },
});
