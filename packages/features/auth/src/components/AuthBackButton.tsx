import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {AuthBackChevron} from './AuthIcons';
import {authTheme} from '../theme/authTheme';

interface AuthBackButtonProps {
  onPress: () => void;
}

export function AuthBackButton({onPress}: AuthBackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="返回"
      onPress={onPress}
      style={styles.hit}>
      <AuthBackChevron color={authTheme.accent} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
