export type BleUiState =
  | 'idle'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error';

export type BleAdapterState =
  | 'unknown'
  | 'on'
  | 'off'
  | 'turningOn'
  | 'turningOff'
  | 'unauthorized'
  | 'unavailable';

export interface BleDevice {
  id: string;
  name: string;
  rssi?: number;
}

export interface BleSnapshot {
  adapterState: BleAdapterState;
  uiState: BleUiState;
  statusMessage: string;
  scanResults: BleDevice[];
  connectedDevice: BleDevice | null;
  discoveredServiceCount: number;
}

export type BleSnapshotListener = (snapshot: BleSnapshot) => void;

export interface BluetoothService {
  getSnapshot(): BleSnapshot;
  subscribe(listener: BleSnapshotListener): () => void;
  startScan(timeoutMs?: number): Promise<void>;
  stopScan(): Promise<void>;
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  /** @deprecated Prefer startScan + subscribe; kept for callers. */
  scan(): Promise<BleDevice[]>;
  getConnectedDevice(): BleDevice | null;
}
