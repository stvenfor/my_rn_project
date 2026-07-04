export interface BleDevice {
  id: string;
  name: string;
  rssi?: number;
}

export interface BluetoothService {
  scan(): Promise<BleDevice[]>;
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  getConnectedDevice(): BleDevice | null;
}
