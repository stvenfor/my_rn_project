import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import type {RootStackScreenProps} from '@core/navigation';
import {getBluetoothService, type BleDevice} from '@core/bluetooth';
import {getImAdapter} from '@core/im';
import {getLinkingService, type PendingNavigation} from '@core/linking';
import {getRealtimeAdapter} from '@core/realtime';
import {selectIsLoggedIn} from '@features/auth';
import {applyLinkingNavigation} from '@app/navigation/applyLinkingNavigation';
import {useAppDispatch, useAppSelector} from '@app/store/hooks';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {
  AppNavBar,
  AppPageScaffold,
  ListRow,
  PrimaryButton,
  spacing,
  typography,
} from '@ui/design-system';

export function DebugBleScreen({navigation}: RootStackScreenProps<'DebugBle'>) {
  const {t} = useTranslation();
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [connected, setConnected] = useState<string | null>(null);

  useEffect(() => {
    getBluetoothService().scan().then(setDevices);
  }, []);

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('debugBleTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <Text style={styles.hint}>{t('debugBleHint')}</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListRow
            title={item.name}
            subtitle={`${item.id} · RSSI ${item.rssi ?? 'n/a'}`}
            onPress={async () => {
              await getBluetoothService().connect(item.id);
              setConnected(item.name);
            }}
          />
        )}
      />
      {connected ? (
        <Text style={styles.status}>
          {t('debugBleConnected')}: {connected}
        </Text>
      ) : null}
    </AppPageScaffold>
  );
}

export function DebugLinkingScreen({
  navigation,
}: RootStackScreenProps<'DebugLinking'>) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const linking = getLinkingService();
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingNavigation | null>(
    linking.getPendingNavigation(),
  );
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const refreshPending = useCallback(() => {
    setPending(linking.getPendingNavigation());
  }, [linking]);

  useEffect(() => {
    return linking.subscribe(url => {
      setLastUrl(url);
      refreshPending();
    });
  }, [linking, refreshPending]);

  const stackNavigation =
    navigation as unknown as StackNavigationProp<RootStackParamList>;

  const emitUrl = (url: string) => {
    linking.emit(url);
    setLastUrl(url);
    refreshPending();
  };

  const applyPending = async () => {
    const next = linking.consumePendingNavigation();
    refreshPending();
    if (!next) {
      setLastApplied('—');
      return;
    }

    const applied = await applyLinkingNavigation(next, {
      dispatch,
      navigation: stackNavigation,
      isLoggedIn,
    });
    setLastApplied(
      applied
        ? `${next.route}${next.params ? ` ${JSON.stringify(next.params)}` : ''}`
        : `failed: ${next.route}`,
    );
  };

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('debugLinkingTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <PrimaryButton
        title={t('debugLinkingSimulate')}
        onPress={() => emitUrl('myapp://app/login?from=debug')}
      />
      <View style={styles.gap} />
      <PrimaryButton
        title={t('debugLinkingSimulateHome')}
        onPress={() => emitUrl('myapp://app/home')}
      />
      <View style={styles.gap} />
      <PrimaryButton
        title={t('debugLinkingSimulateCommunity')}
        onPress={() => emitUrl('myapp://app/community')}
      />
      <View style={styles.gap} />
      <PrimaryButton title={t('debugLinkingApplyPending')} onPress={applyPending} />
      <Text style={styles.status}>
        {t('debugLinkingLast')}: {lastUrl ?? '—'}
      </Text>
      <Text style={styles.status}>
        {t('debugLinkingPending')}:{' '}
        {pending
          ? `${pending.route} ${JSON.stringify(pending.params ?? {})}`
          : '—'}
      </Text>
      <Text style={styles.status}>
        最近应用: {lastApplied ?? '—'}
      </Text>
    </AppPageScaffold>
  );
}

export function DebugRealtimeScreen({
  navigation,
}: RootStackScreenProps<'DebugRealtime'>) {
  const {t} = useTranslation();
  const [state, setState] = useState('disconnected');

  const connect = async () => {
    const adapter = getRealtimeAdapter();
    await adapter.connect('debug_room');
    setState(adapter.getConnectionState());
    await adapter.sendSignal('debug.ping', {source: 'DebugRealtime'});
    setState(adapter.getConnectionState());
  };

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('debugRealtimeTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <PrimaryButton title={t('debugRealtimeConnect')} onPress={connect} />
      <Text style={styles.status}>
        {t('debugRealtimeState')}: {state}
      </Text>
    </AppPageScaffold>
  );
}

export function DebugImScreen({navigation}: RootStackScreenProps<'DebugIm'>) {
  const {t} = useTranslation();
  const [summary, setSummary] = useState('');

  const load = async () => {
    const adapter = getImAdapter();
    const conversations = await adapter.refreshConversations();
    setSummary(
      conversations.map(c => `${c.title} (${c.unreadCount})`).join('\n'),
    );
  };

  return (
    <AppPageScaffold
      contentStyle={{padding: spacing.md}}
      navBar={
        <AppNavBar
          title={t('debugImTitle')}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <PrimaryButton title={t('debugImRefresh')} onPress={load} />
      <Text style={styles.status}>{summary || t('debugImEmpty')}</Text>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  hint: {...typography.caption, marginBottom: 12},
  status: {...typography.body, marginTop: 12},
  gap: {height: 12},
});
