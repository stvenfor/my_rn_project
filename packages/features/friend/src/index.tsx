import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, SectionTitle, typography} from '@ui/design-system';

export function FriendScreen() {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={t('friendTitle')} />
      <View style={styles.center}>
        <Text style={styles.body}>{t('friendModuleLabel')}</Text>
      </View>
    </ScreenContainer>
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
