import {Platform} from 'react-native';
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
    Platform.OS === 'harmony' ||
    isNativeImagePickerAvailable()
  ) {
    configureMediaPickerService(new NativeImagePickerService());
    return;
  }
  configureMediaPickerService(new MockMediaPickerService());
}
