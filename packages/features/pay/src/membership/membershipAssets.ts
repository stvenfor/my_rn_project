import type {ImageSourcePropType} from 'react-native';

export const membershipAssets = {
  badge_trial_price: require('../../assets/membership/badge_trial_price.png'),
  header_ai_svip: require('../../assets/membership/header_ai_svip.png'),
  header_ai_svip_watermark: require('../../assets/membership/header_ai_svip_watermark.png'),
  header_svip: require('../../assets/membership/header_svip.png'),
  header_svip_watermark: require('../../assets/membership/header_svip_watermark.png'),
  icon_alipay: require('../../assets/membership/icon_alipay.png'),
  icon_back: require('../../assets/membership/icon_back.png'),
  icon_check_selected: require('../../assets/membership/icon_check_selected.png'),
  icon_checkbox_selected: require('../../assets/membership/icon_checkbox_selected.png'),
  icon_checkbox_unselected: require('../../assets/membership/icon_checkbox_unselected.png'),
  icon_crown_svip: require('../../assets/membership/icon_crown_svip.png'),
  icon_diamond_ai: require('../../assets/membership/icon_diamond_ai.png'),
  icon_diamond_ai_large: require('../../assets/membership/icon_diamond_ai_large.png'),
  icon_radio_selected_ai: require('../../assets/membership/icon_radio_selected_ai.png'),
  icon_radio_selected_svip: require('../../assets/membership/icon_radio_selected_svip.png'),
  icon_radio_unselected_ai: require('../../assets/membership/icon_radio_unselected_ai.png'),
  icon_radio_unselected_svip: require('../../assets/membership/icon_radio_unselected_svip.png'),
  icon_red_packet_ai: require('../../assets/membership/icon_red_packet_ai.png'),
  icon_red_packet_svip: require('../../assets/membership/icon_red_packet_svip.png'),
  icon_service: require('../../assets/membership/icon_service.png'),
  icon_wechat: require('../../assets/membership/icon_wechat.png'),
  illustration_ai_svip: require('../../assets/membership/illustration_ai_svip.png'),
  illustration_svip: require('../../assets/membership/illustration_svip.png'),
  mask_watermark: require('../../assets/membership/mask_watermark.png'),
  member_card_bg: require('../../assets/membership/member_card_bg.png'),
  tab_ai_svip_center: require('../../assets/membership/tab_ai_svip_center.png'),
  tab_ai_svip_left: require('../../assets/membership/tab_ai_svip_left.png'),
  tab_ai_svip_right: require('../../assets/membership/tab_ai_svip_right.png'),
  tab_svip_center: require('../../assets/membership/tab_svip_center.png'),
  tab_svip_left: require('../../assets/membership/tab_svip_left.png'),
  tab_svip_right: require('../../assets/membership/tab_svip_right.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type MembershipAssetKey = keyof typeof membershipAssets;

export const MEMBERSHIP_ASSET_MANIFEST: Record<string, string> =
  Object.fromEntries(
    (Object.keys(membershipAssets) as MembershipAssetKey[]).map(key => [
      `membership-${key}`,
      `packages/features/pay/assets/membership/${key}.png`,
    ]),
  );
