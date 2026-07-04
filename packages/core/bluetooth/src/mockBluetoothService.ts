import type {BleDevice, BluetoothService} from './types';

const MOCK_DEVICES: BleDevice[] = [
  {id: 'ble_mock_01', name: 'Mock Sensor 01', rssi: -55},
  {id: 'ble_mock_02', name: 'Mock Beacon 02', rssi: -72},
];

export class MockBluetoothService implements BluetoothService {
  private connected: BleDevice | null = null;

  async scan(): Promise<BleDevice[]> {
    return [...MOCK_DEVICES];
  }

  async connect(deviceId: string): Promise<void> {
    const device = MOCK_DEVICES.find(d => d.id === deviceId);
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    this.connected = device;
  }

  async disconnect(): Promise<void> {
    this.connected = null;
  }

  getConnectedDevice(): BleDevice | null {
    return this.connected;
  }
}

let service: BluetoothService = new MockBluetoothService();

export function getBluetoothService(): BluetoothService {
  return service;
}

export function configureBluetoothService(next?: BluetoothService): void {
  service = next ?? new MockBluetoothService();
}
