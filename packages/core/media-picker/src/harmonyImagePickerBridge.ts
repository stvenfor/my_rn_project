import {NativeModules, TurboModuleRegistry} from 'react-native';
import type {ImagePickerResponse} from '@react-native-ohos/react-native-image-picker/src/types';

type NativePickerModule = {
  launchImageLibrary: (
    options: object,
    callback: (result: ImagePickerResponse) => void,
  ) => void;
  launchCamera: (
    options: object,
    callback: (result: ImagePickerResponse) => void,
  ) => void;
};

export function resolveNativeImagePickerModule(): NativePickerModule | null {
  const turboModule = TurboModuleRegistry.get(
    'ImagePicker',
  ) as NativePickerModule | null;
  if (
    turboModule &&
    typeof turboModule.launchImageLibrary === 'function' &&
    typeof turboModule.launchCamera === 'function'
  ) {
    return turboModule;
  }

  const legacyModule = NativeModules.ImagePicker as NativePickerModule | null;
  if (
    legacyModule &&
    typeof legacyModule.launchImageLibrary === 'function' &&
    typeof legacyModule.launchCamera === 'function'
  ) {
    return legacyModule;
  }

  return null;
}

export function invokeNativeImagePicker(
  method: 'launchImageLibrary' | 'launchCamera',
  options: object,
): Promise<ImagePickerResponse> {
  const nativeModule = resolveNativeImagePickerModule();
  if (!nativeModule) {
    return Promise.reject(
      new Error('ImagePicker 原生模块未加载，请重新编译 Harmony 应用'),
    );
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (result: ImagePickerResponse | undefined) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result ?? {didCancel: true});
    };

    try {
      nativeModule[method](options, finish);
    } catch (error) {
      reject(error);
      return;
    }

    setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('相册未响应，请检查 Harmony 权限或重新编译应用'));
      }
    }, 15_000);
  });
}
