import {Platform} from 'react-native';
import {
  NativeImagePickerService,
  isNativeImagePickerAvailable,
} from './nativeImagePickerService';
import {
  MockMediaPickerService,
  configureMediaPickerService,
} from './mockMediaPickerService';
import {isHarmonyOS} from './platform';

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
