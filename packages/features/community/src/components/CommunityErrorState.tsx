import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {CommunityWarningIcon} from './CommunityIcons';
import {communityTheme, communityTypography} from '../theme/communityTheme';

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
      <CommunityWarningIcon />
      <Text style={styles.title}>加载失败</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>重试</Text>
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
  title: {
    ...communityTypography.headline,
    marginTop: 12,
    marginBottom: 8,
  },
  message: {
    ...communityTypography.caption,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: communityTheme.accent,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
