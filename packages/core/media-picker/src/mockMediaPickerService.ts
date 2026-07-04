import type {MediaPickerService, PickedMedia} from './types';

export class MockMediaPickerService implements MediaPickerService {
  async pickImage(): Promise<PickedMedia | null> {
    return {
      uri: 'https://picsum.photos/400/300?random=pick',
      type: 'image',
      fileName: 'mock_pick.jpg',
    };
  }

  async pickImages(maxCount: number): Promise<PickedMedia[]> {
    return Array.from({length: Math.min(maxCount, 2)}, (_, i) => ({
      uri: `https://picsum.photos/400/300?random=pick${i}`,
      type: 'image' as const,
      fileName: `mock_pick_${i}.jpg`,
    }));
  }
}

let service: MediaPickerService = new MockMediaPickerService();

export function getMediaPickerService(): MediaPickerService {
  return service;
}

export function configureMediaPickerService(next?: MediaPickerService): void {
  service = next ?? new MockMediaPickerService();
}
