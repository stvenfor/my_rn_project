import {Platform, UIManager} from 'react-native';

function hasViewManager(name: string): boolean {
  try {
    return UIManager.getViewManagerConfig?.(name) != null;
  } catch {
    return false;
  }
}

/** Harmony / 未 link 原生模块时为 false。 */
export const supportsNativeBlur =
  Platform.OS === 'ios'
    ? hasViewManager('BlurView')
    : Platform.OS === 'android'
    ? hasViewManager('AndroidBlurView') || hasViewManager('BlurView')
    : false;

export const supportsNativeSlider =
  hasViewManager('RNCSlider') || hasViewManager('RCTSlider');

function hasSharedElementNative(): boolean {
  return (
    hasViewManager('RNSharedElementTransition') ||
    hasViewManager('RNSharedElement')
  );
}

/** 仅在原生 SharedElement 已 link 时启用 Stack 转场（鸿蒙未 link 时为 false）。 */
export const supportsSharedElementNavigation =
  (Platform.OS === 'ios' || Platform.OS === 'android') &&
  hasSharedElementNative();

export {hasSharedElementNative};
