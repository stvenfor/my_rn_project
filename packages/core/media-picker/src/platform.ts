import {Platform} from 'react-native';

export function isHarmonyOS(): boolean {
  return (Platform.OS as string) === 'harmony';
}
