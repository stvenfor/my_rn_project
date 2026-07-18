import type {
  MembershipFeatureItem,
  MembershipPlan,
  MembershipPromoBanner,
  MembershipTier,
  MembershipUserProfile,
} from './membershipModels';

export const MEMBERSHIP_DEDUCTION_AMOUNT = 188;
export const MEMBERSHIP_BEAN_BALANCE = 88.88;
export const MEMBERSHIP_PROMO_COUNTDOWN = '2天 22:59:59';
export const MEMBERSHIP_RED_PACKET_COUNTDOWN = '02:32:59';

export const membershipUserProfile: MembershipUserProfile = {
  displayName: '小趣友腻腻',
  levelBadge: 'V3',
  statusText: '您的会员身份已过期',
  avatarUrl: 'https://picsum.photos/seed/membership_child/120/120',
};

export const svipPlans: MembershipPlan[] = [
  {
    id: 'svip_12m',
    tier: 'svip',
    title: '12个月',
    price: 380,
    originalPrice: 488,
    badge: '开学尝鲜价',
    showRedPacket: true,
  },
  {
    id: 'svip_24m',
    tier: 'svip',
    title: '24个月',
    price: 488,
    originalPrice: 888,
    badge: '活动利益点',
    dailyHint: '每日仅需0.66元',
  },
  {
    id: 'svip_year_auto',
    tier: 'svip',
    title: '连续包年',
    price: 288,
    originalPrice: 488,
    dailyHint: '每日仅需0.78元',
  },
];

export const aiSvipPlans: MembershipPlan[] = [
  {
    id: 'ai_12m',
    tier: 'aiSvip',
    title: '12个月',
    price: 488,
    originalPrice: 688,
    badge: '开学尝鲜价',
    showRedPacket: true,
  },
  {
    id: 'ai_24m',
    tier: 'aiSvip',
    title: '24个月',
    price: 688,
    originalPrice: 1288,
    badge: '活动利益点',
    dailyHint: '每日仅需0.94元',
  },
  {
    id: 'ai_year_auto',
    tier: 'aiSvip',
    title: '连续包年',
    price: 398,
    originalPrice: 688,
    dailyHint: '每日仅需1.09元',
  },
];

export const svipPromo: MembershipPromoBanner = {
  tier: 'svip',
  title: '春日踏青礼',
  subtitle: '加赠限定勋章、装扮套装',
  countdownLabel: MEMBERSHIP_PROMO_COUNTDOWN,
};

export const aiSvipPromo: MembershipPromoBanner = {
  tier: 'aiSvip',
  title: '寒假趣超车',
  subtitle: '赠新春礼包',
  countdownLabel: MEMBERSHIP_PROMO_COUNTDOWN,
};

export const aiFeatures: MembershipFeatureItem[] = [
  {
    title: '背单词',
    subtitle: '听音辨义 拼写无忧',
    gradient: ['#7ED957', '#52C41A'],
  },
  {
    title: '读课文',
    subtitle: '智能打分 纠正发音',
    gradient: ['#FFB347', '#FF8A34'],
  },
  {
    title: 'AI私教',
    subtitle: '告别死记 活学活用',
    gradient: ['#6CB6FF', '#3D8BFF'],
  },
  {
    title: '刷真题',
    subtitle: '考点精粹 高效提分',
    gradient: ['#FF7B7B', '#FF4D4F'],
  },
];

export function plansFor(tier: MembershipTier): MembershipPlan[] {
  return tier === 'svip' ? svipPlans : aiSvipPlans;
}

export function promoFor(tier: MembershipTier): MembershipPromoBanner {
  return tier === 'svip' ? svipPromo : aiSvipPromo;
}
