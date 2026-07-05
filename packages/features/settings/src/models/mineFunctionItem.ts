import type {MineFunctionIconKey} from '../assets/settingsAssets';

export interface MineFunctionItem {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  iconColor: string;
  iconKey: MineFunctionIconKey;
}
