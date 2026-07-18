import {ensureBlePermissionGranted} from './blePermission';
import type {
  BleAdapterState,
  BleDevice,
  BleSnapshot,
  BleSnapshotListener,
  BleUiState,
  BluetoothService,
} from './types';

const MOCK_DEVICES: BleDevice[] = [
  {id: 'ble_mock_01', name: 'Mock Sensor 01', rssi: -55},
  {id: 'ble_mock_02', name: 'Mock Beacon 02', rssi: -72},
  {id: 'ble_mock_03', name: '未命名设备', rssi: -81},
];

const DEFAULT_SERVICE_COUNT = 3;
const DEFAULT_SCAN_TIMEOUT_MS = 8000;
const DEFAULT_CONNECT_DELAY_MS = 400;
const DEVICE_APPEAR_DELAY_MS = 350;

export interface MockBluetoothOptions {
  adapterState?: BleAdapterState;
  /** When false, `ensureBlePermissionGranted` is bypassed and treated as denied. */
  permissionGranted?: boolean;
  scanTimeoutMs?: number;
  connectDelayMs?: number;
  discoveredServiceCount?: number;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MockBluetoothService implements BluetoothService {
  private adapterState: BleAdapterState;
  private uiState: BleUiState = 'idle';
  private statusMessage = '';
  private scanResults: BleDevice[] = [];
  private connectedDevice: BleDevice | null = null;
  private discoveredServiceCount = 0;
  private readonly listeners = new Set<BleSnapshotListener>();
  private readonly permissionGranted: boolean;
  private readonly scanTimeoutMs: number;
  private readonly connectDelayMs: number;
  private readonly mockServiceCount: number;
  private scanToken = 0;
  private appearTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: MockBluetoothOptions = {}) {
    this.adapterState = options.adapterState ?? 'on';
    this.permissionGranted = options.permissionGranted ?? true;
    this.scanTimeoutMs = options.scanTimeoutMs ?? DEFAULT_SCAN_TIMEOUT_MS;
    this.connectDelayMs = options.connectDelayMs ?? DEFAULT_CONNECT_DELAY_MS;
    this.mockServiceCount =
      options.discoveredServiceCount ?? DEFAULT_SERVICE_COUNT;
  }

  getSnapshot(): BleSnapshot {
    return {
      adapterState: this.adapterState,
      uiState: this.uiState,
      statusMessage: this.statusMessage,
      scanResults: [...this.scanResults],
      connectedDevice: this.connectedDevice,
      discoveredServiceCount: this.discoveredServiceCount,
    };
  }

  subscribe(listener: BleSnapshotListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const snap = this.getSnapshot();
    this.listeners.forEach(listener => listener(snap));
  }

  private setState(partial: {
    uiState?: BleUiState;
    statusMessage?: string;
    scanResults?: BleDevice[];
    connectedDevice?: BleDevice | null;
    discoveredServiceCount?: number;
    adapterState?: BleAdapterState;
  }): void {
    if (partial.uiState !== undefined) {
      this.uiState = partial.uiState;
    }
    if (partial.statusMessage !== undefined) {
      this.statusMessage = partial.statusMessage;
    }
    if (partial.scanResults !== undefined) {
      this.scanResults = partial.scanResults;
    }
    if (partial.connectedDevice !== undefined) {
      this.connectedDevice = partial.connectedDevice;
    }
    if (partial.discoveredServiceCount !== undefined) {
      this.discoveredServiceCount = partial.discoveredServiceCount;
    }
    if (partial.adapterState !== undefined) {
      this.adapterState = partial.adapterState;
    }
    this.emit();
  }

  private async checkPermission(): Promise<boolean> {
    if (!this.permissionGranted) {
      return false;
    }
    return ensureBlePermissionGranted();
  }

  get isScanning(): boolean {
    return this.uiState === 'scanning';
  }

  get isConnected(): boolean {
    return this.uiState === 'connected';
  }

  async startScan(timeoutMs = this.scanTimeoutMs): Promise<void> {
    if (this.isScanning) {
      return;
    }

    const granted = await this.checkPermission();
    if (!granted) {
      this.setState({
        uiState: 'error',
        statusMessage: '蓝牙或定位权限未授予',
      });
      return;
    }

    if (this.adapterState !== 'on') {
      this.setState({
        uiState: 'error',
        statusMessage: '请先打开手机蓝牙',
      });
      return;
    }

    const token = ++this.scanToken;
    this.clearAppearTimer();
    this.setState({
      uiState: 'scanning',
      statusMessage: '正在扫描附近设备…',
      scanResults: [],
    });

    const appearAt = Math.min(
      DEVICE_APPEAR_DELAY_MS,
      Math.max(0, timeoutMs - 20),
    );
    if (appearAt === 0) {
      this.setState({scanResults: [...MOCK_DEVICES]});
    } else {
      this.appearTimer = setTimeout(() => {
        if (token !== this.scanToken || this.uiState !== 'scanning') {
          return;
        }
        this.setState({scanResults: [...MOCK_DEVICES]});
      }, appearAt);
    }

    try {
      await delay(timeoutMs);
      if (token !== this.scanToken) {
        return;
      }
      this.clearAppearTimer();
      this.setState({
        uiState: 'idle',
        statusMessage: `扫描完成，共 ${this.scanResults.length} 台设备`,
      });
    } catch (e) {
      if (token !== this.scanToken) {
        return;
      }
      this.clearAppearTimer();
      this.setState({
        uiState: 'error',
        statusMessage: `扫描失败: ${e}`,
      });
    }
  }

  async stopScan(): Promise<void> {
    this.cancelScan();
    if (this.uiState === 'scanning') {
      this.setState({
        uiState: 'idle',
        statusMessage: '已停止扫描',
      });
    }
  }

  /** Cancel in-flight scan timer without necessarily changing UI (used before connect). */
  private cancelScan(): void {
    this.scanToken += 1;
    this.clearAppearTimer();
  }

  private clearAppearTimer(): void {
    if (this.appearTimer) {
      clearTimeout(this.appearTimer);
      this.appearTimer = null;
    }
  }

  async connect(deviceId: string): Promise<void> {
    const device =
      this.scanResults.find(d => d.id === deviceId) ??
      MOCK_DEVICES.find(d => d.id === deviceId);

    if (!device) {
      this.setState({
        uiState: 'error',
        statusMessage: `连接失败: Device not found: ${deviceId}`,
      });
      return;
    }

    if (
      this.connectedDevice?.id === device.id &&
      this.uiState === 'connected'
    ) {
      return;
    }

    const granted = await this.checkPermission();
    if (!granted) {
      this.setState({
        uiState: 'error',
        statusMessage: '蓝牙权限未授予',
      });
      return;
    }

    this.cancelScan();
    if (this.uiState === 'scanning') {
      this.setState({uiState: 'idle', statusMessage: this.statusMessage});
    }

    const displayName = device.name || device.id;
    try {
      this.setState({
        uiState: 'connecting',
        statusMessage: `正在连接 ${displayName}…`,
      });
      await delay(this.connectDelayMs);
      this.setState({
        connectedDevice: device,
        discoveredServiceCount: this.mockServiceCount,
        uiState: 'connected',
        statusMessage: `已连接，发现 ${this.mockServiceCount} 个服务`,
      });
    } catch (e) {
      this.setState({
        uiState: 'error',
        statusMessage: `连接失败: ${e}`,
        connectedDevice: null,
        discoveredServiceCount: 0,
      });
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connectedDevice) {
      return;
    }
    this.onDisconnected();
  }

  private onDisconnected(): void {
    this.connectedDevice = null;
    this.discoveredServiceCount = 0;
    if (this.uiState !== 'scanning') {
      this.uiState = 'idle';
    }
    this.statusMessage = '已断开连接';
    this.emit();
  }

  async scan(): Promise<BleDevice[]> {
    await this.startScan(Math.min(this.scanTimeoutMs, 500));
    return [...this.scanResults];
  }

  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }

  /** Test / debug helper */
  setAdapterState(state: BleAdapterState): void {
    this.setState({adapterState: state});
  }
}

let service: BluetoothService = new MockBluetoothService();

export function getBluetoothService(): BluetoothService {
  return service;
}

export function configureBluetoothService(next?: BluetoothService): void {
  service = next ?? new MockBluetoothService();
}
