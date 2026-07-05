import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {
  AppNavBar,
  AppPageScaffold,
  ListRow,
  colors,
  spacing,
  typography,
} from '@ui/design-system';
import {BFUI_TEMPLATES, findBfuiTemplate} from '../bfuiCatalog';
import {BFUI_TEMPLATE_COMPONENTS} from '../templates/templateRegistry';

const CATEGORY_ORDER = [
  'onboarding',
  'hotel',
  'fitness',
  'course',
  'system',
  'effect',
] as const;

export function BfuiGalleryScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.bfuiGallery>) {
  const {t} = useTranslation();

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('bfuiTemplates')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <Text style={styles.summary}>
        {t('bfuiGallerySummary', {count: BFUI_TEMPLATES.length})}
      </Text>
      <ScrollView>
        {CATEGORY_ORDER.map(category => {
          const items = BFUI_TEMPLATES.filter(e => e.category === category);
          if (items.length === 0) {
            return null;
          }
          return (
            <View key={category}>
              <Text style={styles.category}>
                {t(`bfuiCategory_${category}`)}
              </Text>
              {items.map(item => (
                <ListRow
                  key={item.id}
                  title={t(item.titleKey)}
                  subtitle={t(`bfuiStatus_${item.status}`)}
                  onPress={() =>
                    navigation.navigate(RoutePath.bfuiTemplate, {
                      templateId: item.id,
                    })
                  }
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </AppPageScaffold>
  );
}

export function BfuiTemplateScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.bfuiTemplate>) {
  const {t} = useTranslation();
  const template = findBfuiTemplate(route.params?.templateId ?? '');
  const TemplateComponent = template
    ? BFUI_TEMPLATE_COMPONENTS[template.id]
    : null;

  if (!template || !TemplateComponent) {
    return (
      <AppPageScaffold
        contentStyle={{padding: spacing.md}}
        navBar={
          <AppNavBar
            title={t('bfuiTemplates')}
            showBackButton
            onBack={() => navigation.goBack()}
          />
        }>
        <Text style={styles.body}>{t('bfuiTemplateNotFound')}</Text>
      </AppPageScaffold>
    );
  }

  return <TemplateComponent />;
}

const styles = StyleSheet.create({
  summary: {
    ...typography.caption,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  category: {...typography.subtitle, marginTop: 16, marginBottom: 8},
  body: {...typography.body},
});
