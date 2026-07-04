import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {AppEnv} from '@core/domain';
import {RoutePath} from '@core/navigation';
import type {RootStackScreenProps} from '@core/navigation';
import {fetchWanAndroidBanner} from '@core/api-client';
import {
  AppLoading,
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';
import type {MineScreenProps, SettingsScreenProps} from '../types';

export function MineScreen({
  navigation,
  isLoggedIn,
  user,
  envLabel,
  onLogout,
}: MineScreenProps) {
  const {t} = useTranslation();

  return (
    <ScreenContainer>
      <SectionTitle title={t('mineTitle')} />
      <Text style={styles.status}>
        {isLoggedIn ? user?.email ?? user?.phone : t('guest')}
      </Text>
      <ListRow
        title={t('settingsTitle')}
        subtitle={`${t('settingsEnv')}: ${envLabel}`}
        onPress={() => navigation.navigate(RoutePath.settings)}
      />
      <ListRow
        title={t('httpTestTitle')}
        onPress={() => navigation.navigate(RoutePath.mineHttpTest)}
      />
      <ListRow
        title={t('dialogDemoTitle')}
        onPress={() => navigation.navigate(RoutePath.dialogDemo)}
      />
      <ListRow
        title={t('dealInvoiceDemoTitle')}
        onPress={() => navigation.navigate(RoutePath.dealInvoiceDemo)}
      />
      <ListRow
        title={t('debugBleTitle')}
        onPress={() => navigation.navigate(RoutePath.debugBle)}
      />
      <ListRow
        title={t('debugLinkingTitle')}
        onPress={() => navigation.navigate(RoutePath.debugLinking)}
      />
      <ListRow
        title={t('debugRealtimeTitle')}
        onPress={() => navigation.navigate(RoutePath.debugRealtime)}
      />
      <ListRow
        title={t('debugImTitle')}
        onPress={() => navigation.navigate(RoutePath.debugIm)}
      />
      <View style={styles.actions}>
        {isLoggedIn ? (
          <PrimaryButton title={t('logout')} onPress={onLogout} />
        ) : (
          <PrimaryButton
            title={t('goLogin')}
            onPress={() => navigation.navigate(RoutePath.login)}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

export function SettingsScreen({
  currentEnv,
  onSetEnv,
  onSetLocale,
  onSetTheme,
}: SettingsScreenProps) {
  const {t} = useTranslation();

  const envs: {key: AppEnv; label: string}[] = [
    {key: 'test', label: t('envTest')},
    {key: 'staging', label: t('envStaging')},
    {key: 'production', label: t('envProduction')},
  ];

  return (
    <ScreenContainer>
      <SectionTitle title={t('settingsTitle')} />
      <Text style={styles.section}>{t('settingsEnv')}</Text>
      {envs.map(e => (
        <ListRow
          key={e.key}
          title={e.label}
          subtitle={currentEnv === e.key ? '✓' : undefined}
          onPress={() => onSetEnv(e.key)}
        />
      ))}
      <Text style={styles.section}>{t('settingsLanguage')}</Text>
      <ListRow title="简体中文" onPress={() => onSetLocale('zh')} />
      <ListRow title="English" onPress={() => onSetLocale('en')} />
      <Text style={styles.section}>{t('settingsTheme')}</Text>
      <ListRow title="Light" onPress={() => onSetTheme('light')} />
      <ListRow title="Dark" onPress={() => onSetTheme('dark')} />
      <ListRow title="System" onPress={() => onSetTheme('system')} />
    </ScreenContainer>
  );
}

export function MineHttpTestScreen() {
  const {t} = useTranslation();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setError(null);
    setResult(null);
    try {
      const banners = await AppLoading.run(
        () => fetchWanAndroidBanner(),
        t('httpTestRun'),
      );
      setResult(JSON.stringify(banners.slice(0, 3), null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('httpTestFail'));
    }
  };

  return (
    <ScreenContainer>
      <SectionTitle title={t('httpTestTitle')} />
      <PrimaryButton title={t('httpTestRun')} onPress={runTest} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result ? (
        <ScrollView style={styles.resultBox}>
          <Text style={styles.result}>{result}</Text>
        </ScrollView>
      ) : null}
    </ScreenContainer>
  );
}

export function DialogDemoScreen() {
  const {t} = useTranslation();
  const [lastResult, setLastResult] = useState('—');

  return (
    <ScreenContainer>
      <SectionTitle title={t('dialogDemoTitle')} />
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
    </ScreenContainer>
  );
}

export function DealInvoiceDemoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dealInvoiceDemo>) {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={t('dealInvoiceDemoTitle')} />
      <Text style={styles.body}>{t('dealInvoiceDemoDesc')}</Text>
      <ListRow title="订单 #20240704001" subtitle="¥ 12,800.00 · 待开票" />
      <ListRow title="订单 #20240703018" subtitle="¥ 3,200.00 · 已开票" />
      <PrimaryButton
        title={t('dealInvoiceUpload')}
        onPress={() => navigation.navigate(RoutePath.dealInvoiceUpload)}
      />
    </ScreenContainer>
  );
}

export function DealInvoiceUploadScreen() {
  const {t} = useTranslation();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ScreenContainer>
      <SectionTitle title={t('dealInvoiceUpload')} />
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  status: {...typography.subtitle, marginBottom: 16},
  section: {...typography.subtitle, marginTop: 16, marginBottom: 8},
  actions: {marginTop: 24},
  error: {...typography.body, color: colors.error, marginTop: 12},
  resultBox: {marginTop: 12, maxHeight: 320},
  result: {...typography.caption, fontFamily: 'Menlo', marginTop: 12},
  body: {...typography.body, marginBottom: 12},
  statusCard: {
    backgroundColor: colors.borderLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardSub: {...typography.caption, color: colors.textSecondary},
  gap: {height: 12},
});
