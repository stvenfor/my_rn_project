import {Platform} from 'react-native';
import {invokeNativeImagePicker} from './harmonyImagePickerBridge';

export type ImagePickerResult = {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Array<{uri?: string; fileName?: string; type?: string}>;
};

export type PhotoQuality =
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;

export type PickerLaunchOptions = {
  mediaType: 'photo' | 'video' | 'mixed';
  selectionLimit?: number;
  maxWidth?: number;
  quality?: PhotoQuality;
};

function getStandardImagePicker() {
  return require('react-native-image-picker') as typeof import('react-native-image-picker');
}

function invokeStandardImagePicker(
  method: 'launchImageLibrary' | 'launchCamera',
  options: PickerLaunchOptions,
): Promise<ImagePickerResult> {
  const {launchCamera, launchImageLibrary} = getStandardImagePicker();
  const launcher =
    method === 'launchCamera' ? launchCamera : launchImageLibrary;

  return new Promise(resolve => {
    launcher(options, response => {
      resolve(response);
    });
  });
}

export async function launchImagePicker(
  method: 'launchImageLibrary' | 'launchCamera',
  options: PickerLaunchOptions,
): Promise<ImagePickerResult> {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return invokeStandardImagePicker(method, options);
  }

  return invokeNativeImagePicker(method, options);
}
