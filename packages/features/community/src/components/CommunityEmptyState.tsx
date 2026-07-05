import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {communityTheme} from '../theme/communityTheme';

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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.icon}>💬</Text>
      <Text style={styles.text}>暂无动态</Text>
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
  icon: {
    fontSize: communityTheme.emptyIconSize,
    marginBottom: 12,
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    color: communityTheme.emptyTextColor,
  },
});
