import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '@ui/design-system';
import {communityTheme} from '../theme/communityTheme';

interface CommunityErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function CommunityErrorState({
  message,
  onRetry,
}: CommunityErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.title}>加载失败</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>点击重试</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 48,
    color: communityTheme.errorIconColor,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 12,
    color: communityTheme.emptyTextColor,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
