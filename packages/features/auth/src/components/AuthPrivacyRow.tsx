import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AuthCheckIcon} from './AuthIcons';
import {authTextStyles, authTheme} from '../theme/authTheme';

interface AuthPrivacyRowProps {
  checked: boolean;
  onToggle: (value: boolean) => void;
}

export function AuthPrivacyRow({checked, onToggle}: AuthPrivacyRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{checked}}
      onPress={() => onToggle(!checked)}
      style={styles.row}>
      <View style={styles.hitArea}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <AuthCheckIcon size={14} color="#FFFFFF" /> : null}
        </View>
      </View>
      <Text style={[authTextStyles.caption, styles.text]}>
        我已阅读并同意
        <Text style={styles.link}>《某个隐私条款》</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  hitArea: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: authTheme.separator,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: authTheme.accent,
    borderColor: authTheme.accent,
  },
  text: {
    flex: 1,
    paddingTop: 12,
  },
  link: {
    color: authTheme.accent,
  },
});
