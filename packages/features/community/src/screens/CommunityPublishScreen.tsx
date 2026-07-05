import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, colors} from '@ui/design-system';
import {communityTheme} from '../theme/communityTheme';

function CloseButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel="关闭">
      <Text style={styles.closeIcon}>✕</Text>
    </Pressable>
  );
}

export function CommunityPublishScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.communityPublish>) {
  return (
    <AppPageScaffold
      navBar={
        <AppNavBar
          title="发布动态"
          leading={<CloseButton onPress={() => navigation.goBack()} />}
        />
      }>
      <Text style={styles.icon}>📝</Text>
      <Text style={styles.title}>发布动态功能开发中</Text>
      <Text style={styles.subtitle}>后续可接入发帖接口</Text>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: communityTheme.publishPlaceholderIconSize,
    marginTop: 120,
    alignSelf: 'center',
    opacity: 0.45,
  },
  title: {
    fontSize: 16,
    color: communityTheme.publishPlaceholderTextColor,
    marginTop: 16,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: communityTheme.publishPlaceholderHintColor,
    marginTop: 8,
    alignSelf: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: colors.text,
  },
});
