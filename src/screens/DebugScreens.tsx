import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {RootStackScreenProps} from '@core/navigation';
import {getBluetoothService, type BleDevice} from '@core/bluetooth';
import {getImAdapter} from '@core/im';
import {getLinkingService} from '@core/linking';
import {getRealtimeAdapter} from '@core/realtime';
import {
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  typography,
} from '@ui/design-system';

export function DebugBleScreen(_props: RootStackScreenProps<'DebugBle'>) {
  const {t} = useTranslation();
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [connected, setConnected] = useState<string | null>(null);

  useEffect(() => {
    getBluetoothService().scan().then(setDevices);
  }, []);

  return (
    <ScreenContainer>
      <SectionTitle title={t('debugBleTitle')} />
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
    </ScreenContainer>
  );
}

export function DebugLinkingScreen(
  _props: RootStackScreenProps<'DebugLinking'>,
) {
  const {t} = useTranslation();
  const linking = getLinkingService();
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const pending = linking.getPendingNavigation();

  useEffect(() => {
    return linking.subscribe(url => setLastUrl(url));
  }, [linking]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('debugLinkingTitle')} />
      <PrimaryButton
        title={t('debugLinkingSimulate')}
        onPress={() => linking.emit('myapp://app/login?from=debug')}
      />
      <Text style={styles.status}>
        {t('debugLinkingLast')}: {lastUrl ?? '—'}
      </Text>
      <Text style={styles.status}>
        {t('debugLinkingPending')}:{' '}
        {pending
          ? `${pending.route} ${JSON.stringify(pending.params ?? {})}`
          : '—'}
      </Text>
    </ScreenContainer>
  );
}

export function DebugRealtimeScreen(
  _props: RootStackScreenProps<'DebugRealtime'>,
) {
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
    <ScreenContainer>
      <SectionTitle title={t('debugRealtimeTitle')} />
      <PrimaryButton title={t('debugRealtimeConnect')} onPress={connect} />
      <Text style={styles.status}>
        {t('debugRealtimeState')}: {state}
      </Text>
    </ScreenContainer>
  );
}

export function DebugImScreen(_props: RootStackScreenProps<'DebugIm'>) {
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
    <ScreenContainer>
      <SectionTitle title={t('debugImTitle')} />
      <PrimaryButton title={t('debugImRefresh')} onPress={load} />
      <Text style={styles.status}>{summary || t('debugImEmpty')}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: {...typography.caption, marginBottom: 12},
  status: {...typography.body, marginTop: 12},
});
