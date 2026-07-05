import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  AppNavBar,
  AppPageScaffold,
  spacing,
  typography,
} from '@ui/design-system';

export function PlaceholderScreen({
  title,
  moduleId,
}: {
  title: string;
  moduleId: string;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={title}
          showBackButton={canGoBack}
          onBack={() => navigation.goBack()}
        />
      }>
      <Text style={styles.body}>
        {t('placeholderModule')} — {moduleId}
      </Text>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {...typography.body},
});
