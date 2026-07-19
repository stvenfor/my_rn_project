import {Platform} from 'react-native';
import {isHarmonyOS} from '@core/webview/platform';
import {
  NativeImagePickerService,
  isNativeImagePickerAvailable,
} from './nativeImagePickerService';
import {
  MockMediaPickerService,
  configureMediaPickerService,
} from './mockMediaPickerService';

export function bootstrapMediaPickerService(): void {
  if (
    Platform.OS === 'ios' ||
    Platform.OS === 'android' ||
    isHarmonyOS() ||
    isNativeImagePickerAvailable()
  ) {
    configureMediaPickerService(new NativeImagePickerService());
    return;
  }
  configureMediaPickerService(new MockMediaPickerService());
}
