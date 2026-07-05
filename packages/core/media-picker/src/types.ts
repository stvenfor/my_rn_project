export type MediaPickSource = 'gallery' | 'camera';

export interface PickImageOptions {
  source?: MediaPickSource;
  maxWidth?: number;
  imageQuality?: number;
}

export interface PickedMedia {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export interface MediaPickerService {
  pickImage(options?: PickImageOptions): Promise<PickedMedia | null>;
  pickImages(maxCount: number): Promise<PickedMedia[]>;
}
