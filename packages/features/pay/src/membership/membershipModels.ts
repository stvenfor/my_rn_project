export type MembershipTier = 'svip' | 'aiSvip';
export type PaymentMethodType = 'wechat' | 'alipay';

export interface MembershipPlan {
  id: string;
  tier: MembershipTier;
  title: string;
  price: number;
  originalPrice: number;
  badge?: string;
  dailyHint?: string;
  showRedPacket?: boolean;
}

export interface MembershipPromoBanner {
  tier: MembershipTier;
  title: string;
  subtitle: string;
  countdownLabel: string;
}

export interface MembershipFeatureItem {
  title: string;
  subtitle: string;
  gradient: [string, string];
}

export interface MembershipUserProfile {
  displayName: string;
  levelBadge: string;
  statusText: string;
  avatarUrl: string;
}

export interface MembershipPaletteTokens {
  headerGradient: [string, string];
  accent: string;
  accentLight: string;
  planBorder: string;
  ctaGradient: [string, string];
  promoBackground: string;
  promoAccent: string;
  deductionHighlight: string;
  tabSelectedLeft: string;
  tabSelectedRight: string;
  tabUnselectedLeft: string;
  tabUnselectedRight: string;
  illustration: string;
  redPacketIcon: string;
  radioSelected: string;
  radioUnselected: string;
}
