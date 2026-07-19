import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {communityTheme, communityTypography} from '../theme/communityTheme';

function CloseButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel="关闭" hitSlop={8}>
      <Text style={styles.closeIcon}>✕</Text>
    </Pressable>
  );
}

export function CommunityPublishScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.communityPublish>) {
  return (
    <AppPageScaffold
      backgroundColor={communityTheme.background}
      navBar={
        <AppNavBar
          title="发布动态"
          leading={<CloseButton onPress={() => navigation.goBack()} />}
        />
      }>
      <View style={styles.center}>
        <Text style={styles.icon}>✎</Text>
        <Text style={styles.title}>发布动态功能开发中</Text>
        <Text style={styles.subtitle}>后续可接入发帖接口</Text>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: communityTheme.publishPlaceholderIconSize,
    color: communityTheme.publishPlaceholderIconColor,
  },
  title: {
    ...communityTypography.headline,
    fontWeight: '400',
    color: communityTheme.publishPlaceholderTextColor,
    marginTop: 16,
  },
  subtitle: {
    ...communityTypography.caption,
    color: communityTheme.publishPlaceholderHintColor,
    marginTop: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: communityTheme.labelPrimary,
  },
});
