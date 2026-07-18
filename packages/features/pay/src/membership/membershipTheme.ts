import type {MembershipPaletteTokens, MembershipTier} from './membershipModels';

export const membershipDimens = {
  tabBarDesignSliceWidth: 188,
  tabBarDesignSliceHeight: 84,
  tabBarDesignTotalWidth: 564,
  tabIconWidth: 18,
  tabIconHeight: 14,
  headerTopPadding: 8,
  headerActionRowHeight: 38,
  headerProfileGap: 12,
  headerAvatarSize: 48,
  headerBottomPadding: 10,
  planCardWidth: 118,
  planCardHeight: 148,
  planCardRadius: 12,
  planCardPointerHeight: 6,
} as const;

export const membershipPaletteBase = {
  titleBlack: '#333333',
  textGray: '#999999',
  textGrayLight: '#BFBFBF',
  pageBackground: '#F7F7F7',
  cardWhite: '#FFFFFF',
  priceBlack: '#1A1A1A',
  originalPriceGray: '#BFBFBF',
  deductionOrange: '#FF8A34',
  planBadgePromoBg: '#FFF8E6',
  planFooterPeach: '#FFF3E8',
  planBorderUnselected: '#EEEEEE',
} as const;

export function membershipPaletteOf(
  tier: MembershipTier,
): MembershipPaletteTokens {
  if (tier === 'svip') {
    return {
      headerGradient: ['#FFF3D4', '#FFFFFF'],
      accent: '#FF8A34',
      accentLight: '#FFB800',
      planBorder: '#FF8A34',
      ctaGradient: ['#FFD36A', '#FF8A34'],
      promoBackground: '#EFF8E8',
      promoAccent: '#52C41A',
      deductionHighlight: '#FF8A34',
      tabSelectedLeft: 'tab_svip_left',
      tabSelectedRight: 'tab_svip_right',
      tabUnselectedLeft: 'tab_ai_svip_left',
      tabUnselectedRight: 'tab_ai_svip_right',
      illustration: 'illustration_svip',
      redPacketIcon: 'icon_red_packet_svip',
      radioSelected: 'icon_radio_selected_svip',
      radioUnselected: 'icon_radio_unselected_svip',
    };
  }
  return {
    headerGradient: ['#E8E1FF', '#FFFFFF'],
    accent: '#9D7CFF',
    accentLight: '#7B5CFF',
    planBorder: '#9D7CFF',
    ctaGradient: ['#9D7CFF', '#5B7CFF'],
    promoBackground: '#F3EEFF',
    promoAccent: '#9D7CFF',
    deductionHighlight: '#FF8A34',
    tabSelectedLeft: 'tab_ai_svip_left',
    tabSelectedRight: 'tab_ai_svip_right',
    tabUnselectedLeft: 'tab_svip_left',
    tabUnselectedRight: 'tab_svip_right',
    illustration: 'illustration_ai_svip',
    redPacketIcon: 'icon_red_packet_ai',
    radioSelected: 'icon_radio_selected_ai',
    radioUnselected: 'icon_radio_unselected_ai',
  };
}

export function tabBarHeightForWidth(width: number): number {
  return (
    (width * membershipDimens.tabBarDesignSliceHeight) /
    membershipDimens.tabBarDesignTotalWidth
  );
}

export function headerBodyHeight(): number {
  return (
    membershipDimens.headerTopPadding +
    membershipDimens.headerActionRowHeight +
    membershipDimens.headerProfileGap +
    membershipDimens.headerAvatarSize +
    membershipDimens.headerBottomPadding
  );
}
