import {NativeImagePickerService} from '../nativeImagePickerService';
import {MockMediaPickerService} from '../mockMediaPickerService';
import * as launcher from '../imagePickerLauncher';

jest.mock('../imagePickerLauncher', () => ({
  launchImagePicker: jest.fn(),
}));

const launchImagePicker = launcher.launchImagePicker as jest.Mock;

describe('NativeImagePickerService', () => {
  const service = new NativeImagePickerService();

  beforeEach(() => {
    launchImagePicker.mockReset();
  });

  it('returns null when user cancels gallery pick', async () => {
    launchImagePicker.mockResolvedValueOnce({didCancel: true});
    await expect(service.pickImage({source: 'gallery'})).resolves.toBeNull();
    expect(launchImagePicker).toHaveBeenCalledWith(
      'launchImageLibrary',
      expect.objectContaining({mediaType: 'photo', maxWidth: 800}),
    );
  });

  it('returns picked asset from gallery', async () => {
    launchImagePicker.mockResolvedValueOnce({
      assets: [{uri: 'file:///picked.jpg', fileName: 'picked.jpg'}],
    });
    await expect(service.pickImage({source: 'gallery'})).resolves.toEqual({
      uri: 'file:///picked.jpg',
      type: 'image',
      fileName: 'picked.jpg',
    });
  });

  it('throws when native returns error code', async () => {
    launchImagePicker.mockResolvedValueOnce({
      errorCode: 'permission',
      errorMessage: '需要相册权限',
    });
    await expect(service.pickImage({source: 'gallery'})).rejects.toThrow(
      '需要相册权限',
    );
  });

  it('throws when response has no asset uri', async () => {
    launchImagePicker.mockResolvedValueOnce({assets: [{}]});
    await expect(service.pickImage({source: 'gallery'})).rejects.toThrow(
      '未获取到图片，请重试',
    );
  });
});

describe('MockMediaPickerService', () => {
  it('does not auto-return mock image', async () => {
    const mock = new MockMediaPickerService();
    await expect(mock.pickImage()).resolves.toBeNull();
  });
});
