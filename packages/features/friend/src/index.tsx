import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  AppNavBar,
  AppPageScaffold,
  spacing,
  typography,
} from '@ui/design-system';

export function FriendScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('friendTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.center}>
        <Text style={styles.body}>{t('friendModuleLabel')}</Text>
      </View>
    </AppPageScaffold>
  );
}

export {registerFriendFeature} from './registerFriendFeature';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  body: {...typography.body},
});
