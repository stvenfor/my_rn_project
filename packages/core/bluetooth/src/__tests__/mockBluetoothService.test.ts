import {
  MockBluetoothService,
  bleAdapterLabel,
  bleUiLabel,
  configureBluetoothService,
  getBluetoothService,
} from '..';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitFor(
  predicate: () => boolean,
  timeoutMs = 1000,
): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('waitFor timeout');
    }
    await delay(5);
  }
}

describe('MockBluetoothService', () => {
  beforeEach(() => {
    configureBluetoothService(
      new MockBluetoothService({
        scanTimeoutMs: 80,
        connectDelayMs: 20,
      }),
    );
  });

  afterEach(() => {
    configureBluetoothService();
  });

  it('exposes adapter/ui labels matching Flutter', () => {
    expect(bleAdapterLabel('on')).toBe('蓝牙已开启');
    expect(bleAdapterLabel('off')).toBe('蓝牙已关闭');
    expect(bleUiLabel('scanning')).toBe('扫描中');
    expect(bleUiLabel('connected')).toBe('已连接');
  });

  it('scans then completes with device count message', async () => {
    const ble = getBluetoothService();
    const snapshots: string[] = [];
    const unsub = ble.subscribe(s => snapshots.push(s.uiState));

    const scanPromise = ble.startScan(80);
    await waitFor(() => ble.getSnapshot().uiState === 'scanning');
    expect(ble.getSnapshot().statusMessage).toBe('正在扫描附近设备…');

    await scanPromise;
    const snap = ble.getSnapshot();
    expect(snap.uiState).toBe('idle');
    expect(snap.scanResults.length).toBeGreaterThan(0);
    expect(snap.statusMessage).toBe(
      `扫描完成，共 ${snap.scanResults.length} 台设备`,
    );
    unsub();
    expect(snapshots).toContain('scanning');
  });

  it('rejects scan when adapter is off', async () => {
    configureBluetoothService(
      new MockBluetoothService({adapterState: 'off', scanTimeoutMs: 50}),
    );
    const ble = getBluetoothService();
    await ble.startScan();
    expect(ble.getSnapshot().uiState).toBe('error');
    expect(ble.getSnapshot().statusMessage).toBe('请先打开手机蓝牙');
  });

  it('rejects scan when permission denied', async () => {
    configureBluetoothService(
      new MockBluetoothService({permissionGranted: false, scanTimeoutMs: 50}),
    );
    const ble = getBluetoothService();
    await ble.startScan();
    expect(ble.getSnapshot().uiState).toBe('error');
    expect(ble.getSnapshot().statusMessage).toBe('蓝牙或定位权限未授予');
  });

  it('connects, reports service count, then disconnects', async () => {
    const ble = getBluetoothService();
    await ble.startScan(50);
    const device = ble.getSnapshot().scanResults[0];
    expect(device).toBeTruthy();

    await ble.connect(device.id);
    let snap = ble.getSnapshot();
    expect(snap.uiState).toBe('connected');
    expect(snap.connectedDevice?.id).toBe(device.id);
    expect(snap.discoveredServiceCount).toBe(3);
    expect(snap.statusMessage).toContain('已连接，发现');

    await ble.disconnect();
    snap = ble.getSnapshot();
    expect(snap.uiState).toBe('idle');
    expect(snap.connectedDevice).toBeNull();
    expect(snap.statusMessage).toBe('已断开连接');
  });

  it('stopScan while scanning sets 已停止扫描', async () => {
    const ble = getBluetoothService();
    const pending = ble.startScan(500);
    await waitFor(() => ble.getSnapshot().uiState === 'scanning');
    await ble.stopScan();
    expect(ble.getSnapshot().uiState).toBe('idle');
    expect(ble.getSnapshot().statusMessage).toBe('已停止扫描');
    await pending;
  });
});
