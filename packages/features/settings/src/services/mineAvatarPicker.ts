import {Alert} from 'react-native';
import {isHarmonyOS} from '@core/webview/platform';
import {AppToast} from '@ui/design-system';
import {getMediaPickerService} from '@core/media-picker';
import {getPermissionsService} from '@core/permissions';
import type {MediaPickSource} from '../components/MediaSourceBottomSheet';

function showFeedback(message: string, options?: {alert?: boolean}) {
  AppToast.show(message);
  if (isHarmonyOS() || options?.alert) {
    Alert.alert('提示', message);
  }
}

function waitForSheetDismiss() {
  return new Promise<void>(resolve => {
    setTimeout(resolve, 320);
  });
}

export async function pickMineAvatarMedia(
  source: MediaPickSource,
  onPicked: (uri: string) => void,
): Promise<void> {
  await waitForSheetDismiss();

  if (source === 'camera') {
    const permission = await getPermissionsService().request('camera');
    if (permission !== 'granted') {
      showFeedback('需要相机权限才能拍摄');
      return;
    }
  }

  try {
    const picked = await getMediaPickerService().pickImage({
      source,
      maxWidth: 800,
      imageQuality: 85,
    });
    if (!picked) {
      return;
    }
    onPicked(picked.uri);
    showFeedback('头像已更新');
  } catch (error) {
    const message = error instanceof Error ? error.message : '选择图片失败';
    showFeedback(message, {alert: true});
  }
}
