import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RoutePath} from '@core/navigation';
import type {RootStackScreenProps} from '@core/navigation';
import {
  AppNavBar,
  AppPageScaffold,
  ListRow,
  PrimaryButton,
  colors,
  spacing,
  typography,
} from '@ui/design-system';

export function DialogDemoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dialogDemo>) {
  const {t} = useTranslation();
  const [lastResult, setLastResult] = useState('—');

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('dialogDemoTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.statusCard}>
        <Text style={styles.cardSub}>
          {t('dialogLastResult')}: {lastResult}
        </Text>
      </View>
      <PrimaryButton
        title={t('dialogAlert')}
        onPress={() => {
          Alert.alert('温馨提示', '这是单按钮提示弹框，点击确认后关闭。', [
            {text: '确认', onPress: () => setLastResult('alert:确认')},
          ]);
        }}
      />
      <View style={styles.gap} />
      <PrimaryButton
        title={t('dialogConfirm')}
        onPress={() => {
          Alert.alert('确认操作', '确定要执行此操作吗？', [
            {text: '取消', onPress: () => setLastResult('confirm:取消')},
            {text: '确定', onPress: () => setLastResult('confirm:确定')},
          ]);
        }}
      />
    </AppPageScaffold>
  );
}

export function DealInvoiceDemoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dealInvoiceDemo>) {
  const {t} = useTranslation();
  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('dealInvoiceDemoTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <Text style={styles.body}>{t('dealInvoiceDemoDesc')}</Text>
      <ListRow title="订单 #20240704001" subtitle="¥ 12,800.00 · 待开票" />
      <ListRow title="订单 #20240703018" subtitle="¥ 3,200.00 · 已开票" />
      <PrimaryButton
        title={t('dealInvoiceUpload')}
        onPress={() => navigation.navigate(RoutePath.dealInvoiceUpload)}
      />
    </AppPageScaffold>
  );
}

export function DealInvoiceUploadScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dealInvoiceUpload>) {
  const {t} = useTranslation();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('dealInvoiceUpload')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <Text style={styles.body}>{t('dealInvoiceUploadDesc')}</Text>
      <PrimaryButton
        title={t('dealInvoicePickFile')}
        onPress={() => setFileName('invoice_20240704.pdf')}
      />
      {fileName ? (
        <Text style={styles.result}>
          {t('dealInvoiceSelected', {fileName})}
        </Text>
      ) : null}
      <View style={styles.gap} />
      <PrimaryButton title={t('dealInvoiceSubmit')} onPress={() => {}} />
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {...typography.body, marginBottom: 12},
  statusCard: {
    backgroundColor: colors.borderLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardSub: {...typography.caption, color: colors.textSecondary},
  gap: {height: 12},
  result: {...typography.caption, fontFamily: 'Menlo', marginTop: 12},
});
