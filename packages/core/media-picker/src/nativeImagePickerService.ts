import {Platform} from 'react-native';
import {launchImagePicker} from './imagePickerLauncher';
import {resolveNativeImagePickerModule} from './harmonyImagePickerBridge';
import {isHarmonyOS} from './platform';
import type {
  MediaPickerService,
  PickImageOptions,
  PickedMedia,
} from './types';

type PhotoQuality =
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

function toPhotoQuality(imageQuality: number): PhotoQuality {
  const normalized = Math.min(100, Math.max(0, imageQuality)) / 100;
  const steps: PhotoQuality[] = [
    0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
  ];
  return steps.reduce((closest, step) =>
    Math.abs(step - normalized) < Math.abs(closest - normalized) ? step : closest,
  );
}

function mapResponseAsset(response: {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Array<{uri?: string; fileName?: string; type?: string}>;
}): PickedMedia | null {
  if (!response || response.didCancel) {
    return null;
  }
  if (response.errorCode) {
    throw new Error(response.errorMessage ?? response.errorCode);
  }
  const asset = response.assets?.[0];
  if (!asset?.uri) {
    throw new Error('未获取到图片，请重试');
  }
  return {
    uri: asset.uri,
    type: asset.type?.startsWith('video') ? 'video' : 'image',
    fileName: asset.fileName,
  };
}

export class NativeImagePickerService implements MediaPickerService {
  async pickImage(options: PickImageOptions = {}): Promise<PickedMedia | null> {
    if (!isNativeImagePickerAvailable()) {
      throw new Error(
        isHarmonyOS()
          ? '相册模块未就绪，请重新编译 Harmony 应用'
          : '相册模块未就绪，请重新编译应用',
      );
    }

    const source = options.source ?? 'gallery';
    const pickerOptions = {
      mediaType: 'photo' as const,
      selectionLimit: 1,
      maxWidth: options.maxWidth ?? 800,
      quality: toPhotoQuality(options.imageQuality ?? 85),
    };

    const response = await launchImagePicker(
      source === 'camera' ? 'launchCamera' : 'launchImageLibrary',
      pickerOptions,
    );

    return mapResponseAsset(response);
  }

  async pickImages(maxCount: number): Promise<PickedMedia[]> {
    const response = await launchImagePicker('launchImageLibrary', {
      mediaType: 'photo',
      selectionLimit: maxCount,
    });
    if (!response || response.didCancel || !response.assets?.length) {
      return [];
    }
    if (response.errorCode) {
      throw new Error(response.errorMessage ?? response.errorCode);
    }
    return response.assets
      .filter(asset => asset.uri)
      .map(asset => ({
        uri: asset.uri!,
        type: asset.type?.startsWith('video') ? 'video' : 'image',
        fileName: asset.fileName,
      }));
  }
}

export function isNativeImagePickerAvailable(): boolean {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return true;
  }
  if (resolveNativeImagePickerModule()) {
    return true;
  }
  return isHarmonyOS();
}
