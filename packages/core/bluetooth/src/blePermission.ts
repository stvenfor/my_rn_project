import {Platform} from 'react-native';
import {getPermissionsService} from '@core/permissions';

/**
 * Aligns with Flutter `BlePermissionHelper.ensureGranted`.
 * Android: bluetooth (+ location when available). iOS: Info.plist gated → true.
 */
export async function ensureBlePermissionGranted(): Promise<boolean> {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return true;
  }

  if (Platform.OS === 'android') {
    const permissions = getPermissionsService();
    const bluetooth = await permissions.request('bluetooth');
    // Flutter also requests locationWhenInUse (some Android OEMs still need it).
    const location = await permissions.request('location');
    return bluetooth === 'granted' && location === 'granted';
  }

  // iOS: system prompt on first real scan/connect; mock path always proceeds.
  return true;
}
