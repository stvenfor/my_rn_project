import type {BleAdapterState, BleUiState} from './types';

/** Flutter `_adapterLabel` */
export function bleAdapterLabel(state: BleAdapterState): string {
  switch (state) {
    case 'on':
      return '蓝牙已开启';
    case 'off':
      return '蓝牙已关闭';
    case 'turningOn':
      return '蓝牙开启中';
    case 'turningOff':
      return '蓝牙关闭中';
    case 'unauthorized':
      return '未授权';
    case 'unavailable':
      return '不可用';
    default:
      return '未知';
  }
}

/** Flutter `_uiLabel` */
export function bleUiLabel(state: BleUiState): string {
  switch (state) {
    case 'idle':
      return '空闲';
    case 'scanning':
      return '扫描中';
    case 'connecting':
      return '连接中';
    case 'connected':
      return '已连接';
    case 'error':
      return '异常';
  }
}
