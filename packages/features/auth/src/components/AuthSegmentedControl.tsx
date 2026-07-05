import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {AuthCredentialMode} from '../models/authCredentialMode';
import {authTheme} from '../theme/authTheme';

interface AuthSegmentedControlProps {
  value: AuthCredentialMode;
  onChange: (mode: AuthCredentialMode) => void;
}

const SEGMENTS: Array<{
  value: AuthCredentialMode;
  label: string;
  icon: string;
}> = [
  {value: 'email', label: '邮箱登录', icon: '✉'},
  {value: 'phone', label: '短信登录', icon: '✆'},
];

export function AuthSegmentedControl({
  value,
  onChange,
}: AuthSegmentedControlProps) {
  return (
    <View style={styles.root}>
      {SEGMENTS.map(segment => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="button"
            onPress={() => onChange(segment.value)}
            style={[styles.segment, selected && styles.segmentSelected]}>
            <Text style={[styles.icon, selected && styles.segmentTextSelected]}>
              {segment.icon}
            </Text>
            <Text
              style={[styles.label, selected && styles.segmentTextSelected]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: authTheme.dividerGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  segmentSelected: {
    backgroundColor: 'rgba(27, 130, 210, 0.12)',
  },
  icon: {
    fontSize: 16,
    color: authTheme.textGray,
  },
  label: {
    fontSize: 14,
    color: authTheme.textGray,
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: authTheme.primaryBlue,
    fontWeight: '600',
  },
});
