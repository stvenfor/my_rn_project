export interface PickedMedia {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export interface MediaPickerService {
  pickImage(): Promise<PickedMedia | null>;
  pickImages(maxCount: number): Promise<PickedMedia[]>;
}
