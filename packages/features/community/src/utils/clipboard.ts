import {Clipboard} from 'react-native';

export async function copyToClipboard(text: string): Promise<void> {
  Clipboard.setString(text);
}
