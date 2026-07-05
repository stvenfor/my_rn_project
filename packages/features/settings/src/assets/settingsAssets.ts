import type {ImageSourcePropType} from 'react-native';

export const mineFunctionIcons = {
  sms: require('../../assets/mine_functions/sms.png'),
  calculator: require('../../assets/mine_functions/calculator.png'),
  used_car: require('../../assets/mine_functions/used_car.png'),
  short_video: require('../../assets/mine_functions/short_video.png'),
  after_sales: require('../../assets/mine_functions/after_sales.png'),
  qr_pay: require('../../assets/mine_functions/qr_pay.png'),
  qa: require('../../assets/mine_functions/qa.png'),
  poster: require('../../assets/mine_functions/poster.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type MineFunctionIconKey = keyof typeof mineFunctionIcons;

export const SETTINGS_ASSET_MANIFEST: Record<MineFunctionIconKey, string> = {
  sms: 'packages/features/settings/assets/mine_functions/sms.png',
  calculator: 'packages/features/settings/assets/mine_functions/calculator.png',
  used_car: 'packages/features/settings/assets/mine_functions/used_car.png',
  short_video: 'packages/features/settings/assets/mine_functions/short_video.png',
  after_sales: 'packages/features/settings/assets/mine_functions/after_sales.png',
  qr_pay: 'packages/features/settings/assets/mine_functions/qr_pay.png',
  qa: 'packages/features/settings/assets/mine_functions/qa.png',
  poster: 'packages/features/settings/assets/mine_functions/poster.png',
};
