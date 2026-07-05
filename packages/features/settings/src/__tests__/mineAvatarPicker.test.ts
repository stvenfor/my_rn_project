import {Alert, Platform} from 'react-native';
import {getMediaPickerService} from '@core/media-picker';
import {pickMineAvatarMedia} from '../services/mineAvatarPicker';

jest.mock('@core/media-picker', () => ({
  getMediaPickerService: jest.fn(),
}));

jest.mock('@core/permissions', () => ({
  getPermissionsService: () => ({
    request: jest.fn().mockResolvedValue('granted'),
  }),
}));

jest.mock('@ui/design-system', () => ({
  AppToast: {show: jest.fn()},
}));

describe('pickMineAvatarMedia', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (Platform as {OS: string}).OS = 'harmony';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows alert when picker throws on harmony', async () => {
    (getMediaPickerService as jest.Mock).mockReturnValue({
      pickImage: jest.fn().mockRejectedValue(new Error('ImagePicker 原生模块未加载')),
    });

    await pickMineAvatarMedia('gallery', jest.fn());

    expect(Alert.alert).toHaveBeenCalledWith(
      '提示',
      'ImagePicker 原生模块未加载',
    );
  });
});
