import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {CommunityChatBubblesIcon} from './CommunityIcons';
import {communityTheme, communityTypography} from '../theme/communityTheme';

interface CommunityEmptyStateProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function CommunityEmptyState({
  refreshing,
  onRefresh,
}: CommunityEmptyStateProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={communityTheme.accent}
          colors={[communityTheme.accent]}
        />
      }>
      <CommunityChatBubblesIcon />
      <Text style={styles.text}>暂无动态</Text>
      <Text style={styles.subtitle}>发布第一条动态，开始互动吧</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...communityTypography.caption,
    marginTop: 12,
  },
  subtitle: {
    ...communityTypography.caption,
    color: communityTheme.labelTertiary,
    marginTop: 8,
  },
});
