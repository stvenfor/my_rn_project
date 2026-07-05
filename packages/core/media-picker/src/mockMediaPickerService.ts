import type {MediaPickerService, PickImageOptions, PickedMedia} from './types';

export class MockMediaPickerService implements MediaPickerService {
  async pickImage(_options?: PickImageOptions): Promise<PickedMedia | null> {
    return null;
  }

  async pickImages(_maxCount: number): Promise<PickedMedia[]> {
    return [];
  }
}

let service: MediaPickerService = new MockMediaPickerService();

export function getMediaPickerService(): MediaPickerService {
  return service;
}

export function configureMediaPickerService(next?: MediaPickerService): void {
  service = next ?? new MockMediaPickerService();
}
