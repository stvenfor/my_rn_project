import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  getRealtimeAdapter,
  type RealtimeConnectionState,
  type RealtimeSignal,
} from '@core/realtime';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';

const LIVE_ROOMS = [
  {id: 'room_001', title: '新车发布直播间', viewers: 1280},
  {id: 'room_002', title: '保养知识直播', viewers: 456},
  {id: 'mock_room_001', title: 'Mock 体验房', viewers: 12},
];

function useLiveRoomRealtime(roomId: string) {
  const [connectionState, setConnectionState] =
    useState<RealtimeConnectionState>('disconnected');
  const [signals, setSignals] = useState<RealtimeSignal[]>([]);

  useEffect(() => {
    const adapter = getRealtimeAdapter();
    let mounted = true;
    const unsubscribe = adapter.subscribe(_signal => {
      if (mounted) {
        setSignals(adapter.getSignals());
      }
    });

    adapter.connect(roomId).then(() => {
      if (mounted) {
        setConnectionState(adapter.getConnectionState());
        setSignals(adapter.getSignals());
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      adapter.disconnect();
    };
  }, [roomId]);

  const sendSignal = useCallback(async () => {
    const adapter = getRealtimeAdapter();
    await adapter.sendSignal('live.join', {
      seq: adapter.getSignals().length + 1,
    });
    setSignals(adapter.getSignals());
    setConnectionState(adapter.getConnectionState());
  }, []);

  return {connectionState, signals, sendSignal};
}

export function LiveScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.live>) {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={t('liveTitle')} />
      <Text style={styles.body}>{t('liveDesc')}</Text>
      {LIVE_ROOMS.map(room => (
        <ListRow
          key={room.id}
          title={room.title}
          subtitle={`${room.viewers} ${t('liveViewers')}`}
          onPress={() =>
            navigation.navigate(RoutePath.liveRoom, {roomId: room.id})
          }
        />
      ))}
    </ScreenContainer>
  );
}

export function LiveRoomScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.liveRoom>) {
  const {t} = useTranslation();
  const roomId = route.params?.roomId ?? 'mock_room';
  const {connectionState, signals, sendSignal} = useLiveRoomRealtime(roomId);

  return (
    <ScreenContainer>
      <SectionTitle title={`${t('liveRoomTitle')} · ${roomId}`} />
      <Text style={styles.status}>WS: {connectionState}</Text>
      {connectionState === 'connecting' ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : null}
      <PrimaryButton title={t('liveSendSignal')} onPress={sendSignal} />
      <View style={styles.divider} />
      <FlatList
        data={signals}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('liveNoSignals')}</Text>
        }
        renderItem={({item}) => (
          <Text style={styles.signal}>
            [{item.type}] {JSON.stringify(item.payload)} @ {item.timestamp}
          </Text>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {...typography.body, marginBottom: 16},
  status: {
    ...typography.caption,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  divider: {height: 1, backgroundColor: colors.divider, marginVertical: 12},
  signal: {...typography.caption, paddingVertical: 6, fontSize: 12},
  empty: {...typography.caption, color: colors.textMuted, marginTop: 8},
});

export {registerLiveFeature} from './registerLiveFeature';
