import {Platform} from 'react-native';

export function isHarmonyOS(): boolean {
  return (Platform.OS as string) === 'harmony';
}

export function isAndroidOS(): boolean {
  return Platform.OS === 'android';
}

export function isIOSOS(): boolean {
  return Platform.OS === 'ios';
}
