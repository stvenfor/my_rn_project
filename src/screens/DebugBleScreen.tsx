import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {
  BleBluetoothConnectedIcon,
  BleBluetoothIcon,
  BleCheckCircleIcon,
  BleSearchIcon,
  bleAdapterLabel,
  bleUiLabel,
  getBluetoothService,
  type BleDevice,
  type BleSnapshot,
} from '@core/bluetooth';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';

/** Flutter AppTheme.accent / Material 3 FilledButton primary */
const ACCENT = '#007AFF';
const PAGE_BG = '#F2F2F7';
const STATUS_MSG_COLOR = '#616161'; // Colors.grey.shade700
const EMPTY_COLOR = '#757575'; // Colors.grey.shade600
const DIVIDER = '#C6C6C8';
const CONNECTED_BLUE = '#007AFF';
const CHECK_GREEN = '#4CAF50';

const initialSnapshot: BleSnapshot = {
  adapterState: 'unknown',
  uiState: 'idle',
  statusMessage: '',
  scanResults: [],
  connectedDevice: null,
  discoveredServiceCount: 0,
};

export function DebugBleScreen({navigation}: RootStackScreenProps<'DebugBle'>) {
  const [snap, setSnap] = useState<BleSnapshot>(initialSnapshot);
  const ble = getBluetoothService();

  useEffect(() => {
    return ble.subscribe(setSnap);
  }, [ble]);

  const isScanning = snap.uiState === 'scanning';
  const isConnected = snap.uiState === 'connected';
  const isConnecting = snap.uiState === 'connecting';

  const onScan = useCallback(() => {
    ble.startScan().catch(() => undefined);
  }, [ble]);

  const onStopOrDisconnect = useCallback(() => {
    if (isConnected) {
      ble.disconnect().catch(() => undefined);
    } else {
      ble.stopScan().catch(() => undefined);
    }
  }, [ble, isConnected]);

  const onConnect = useCallback(
    (deviceId: string) => {
      if (isConnecting) {
        return;
      }
      ble.connect(deviceId).catch(() => undefined);
    },
    [ble, isConnecting],
  );

  const connectedId = snap.connectedDevice?.id;

  const renderItem = useCallback(
    ({item}: {item: BleDevice}) => {
      const connected = connectedId === item.id && isConnected;
      const name = item.name?.trim() ? item.name : '未命名设备';
      return (
        <Pressable
          style={({pressed}) => [styles.tile, pressed && styles.tilePressed]}
          disabled={connected || isConnecting}
          onPress={() => onConnect(item.id)}>
          <View style={styles.tileLeading}>
            {connected ? (
              <BleBluetoothConnectedIcon color={CONNECTED_BLUE} size={24} />
            ) : (
              <BleBluetoothIcon color="#666666" size={24} />
            )}
          </View>
          <View style={styles.tileBody}>
            <Text style={styles.tileTitle}>{name}</Text>
            <Text style={styles.tileSubtitle}>
              {item.id} · RSSI {item.rssi ?? 'n/a'} dBm
            </Text>
          </View>
          {connected ? (
            <BleCheckCircleIcon color={CHECK_GREEN} size={22} />
          ) : (
            <Pressable
              disabled={isConnecting}
              onPress={() => onConnect(item.id)}
              hitSlop={8}
              style={styles.connectBtn}>
              <Text
                style={[
                  styles.connectBtnText,
                  isConnecting && styles.connectBtnDisabled,
                ]}>
                连接
              </Text>
            </Pressable>
          )}
        </Pressable>
      );
    },
    [connectedId, isConnected, isConnecting, onConnect],
  );

  const listEmpty = (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>
        {isScanning ? '正在搜索 BLE 设备…' : '点击「扫描设备」开始'}
      </Text>
    </View>
  );

  return (
    <AppPageScaffold
      backgroundColor={PAGE_BG}
      contentStyle={styles.body}
      navBar={
        <AppNavBar
          title="蓝牙连接示例"
          showBackButton
          backgroundColor="#FFFFFF"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.statusPanel}>
        <Text style={styles.statusLine}>
          适配器: {bleAdapterLabel(snap.adapterState)}
        </Text>
        <Text style={[styles.statusLine, styles.statusGap]}>
          状态: {bleUiLabel(snap.uiState)}
        </Text>
        {snap.statusMessage ? (
          <Text style={[styles.statusMessage, styles.statusGap]}>
            {snap.statusMessage}
          </Text>
        ) : null}
        {isConnected && snap.connectedDevice ? (
          <>
            <Text style={[styles.connectedName, styles.connectedGap]}>
              已连接:{' '}
              {snap.connectedDevice.name?.trim()
                ? snap.connectedDevice.name
                : snap.connectedDevice.id}
            </Text>
            <Text style={styles.statusLine}>
              服务数: {snap.discoveredServiceCount}
            </Text>
          </>
        ) : null}
      </View>

      <View style={styles.actionBar}>
        <Pressable
          disabled={isScanning}
          onPress={onScan}
          style={({pressed}) => [
            styles.filledBtn,
            isScanning && styles.filledBtnDisabled,
            pressed && !isScanning && styles.filledBtnPressed,
          ]}>
          {isScanning ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <BleSearchIcon color="#FFFFFF" size={16} />
          )}
          <Text style={styles.filledBtnText}>
            {isScanning ? '扫描中…' : '扫描设备'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onStopOrDisconnect}
          style={({pressed}) => [
            styles.outlinedBtn,
            pressed && styles.outlinedBtnPressed,
          ]}>
          <Text style={styles.outlinedBtnText}>
            {isConnected ? '断开' : '停止'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <FlatList
        style={styles.list}
        data={snap.scanResults}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        ItemSeparatorComponent={ListSeparator}
      />
    </AppPageScaffold>
  );
}

function ListSeparator() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  statusPanel: {
    padding: 16,
  },
  statusLine: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  statusGap: {
    marginTop: 4,
  },
  statusMessage: {
    fontSize: 13,
    color: STATUS_MSG_COLOR,
  },
  connectedGap: {
    marginTop: 8,
  },
  connectedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filledBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  filledBtnPressed: {
    opacity: 0.88,
  },
  filledBtnDisabled: {
    opacity: 0.55,
  },
  filledBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  outlinedBtn: {
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedBtnPressed: {
    backgroundColor: 'rgba(0,122,255,0.08)',
  },
  outlinedBtnText: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER,
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  empty: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: EMPTY_COLOR,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 72,
  },
  tilePressed: {
    backgroundColor: '#F2F2F7',
  },
  tileLeading: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  tileBody: {
    flex: 1,
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  tileSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#666666',
  },
  connectBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  connectBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  connectBtnDisabled: {
    opacity: 0.4,
  },
});
