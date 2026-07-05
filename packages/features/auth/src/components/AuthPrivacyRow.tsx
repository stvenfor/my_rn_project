import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {authTheme} from '../theme/authTheme';

interface AuthPrivacyRowProps {
  checked: boolean;
  onToggle: (value: boolean) => void;
}

export function AuthPrivacyRow({checked, onToggle}: AuthPrivacyRowProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{checked}}
        onPress={() => onToggle(!checked)}
        style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>
      <Text style={styles.text}>
        我已阅读并同意
        <Text style={styles.link}>《某个隐私条款》</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: authTheme.dividerGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: authTheme.primaryBlue,
    borderColor: authTheme.primaryBlue,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: authTheme.textGray,
    lineHeight: 18,
  },
  link: {
    color: authTheme.primaryBlue,
  },
});
