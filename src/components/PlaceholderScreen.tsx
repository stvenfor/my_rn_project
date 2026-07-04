import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, SectionTitle, typography} from '@ui/design-system';

export function PlaceholderScreen({
  title,
  moduleId,
}: {
  title: string;
  moduleId: string;
}) {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={title} />
      <Text style={styles.body}>
        {t('placeholderModule')} — {moduleId}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {...typography.body},
});
