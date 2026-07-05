import {UIManager} from 'react-native';

const NATIVE_VIDEO_VIEW_NAMES = ['RCTVideo', 'RNCVideo'] as const;

export function isNativeVideoAvailable(): boolean {
  return NATIVE_VIDEO_VIEW_NAMES.some(name => {
    try {
      return UIManager.getViewManagerConfig(name) != null;
    } catch {
      return false;
    }
  });
}
