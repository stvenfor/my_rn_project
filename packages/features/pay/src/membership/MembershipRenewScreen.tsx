import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {membershipAssets} from './membershipAssets';
import type {
  MembershipPlan,
  MembershipPaletteTokens,
  MembershipTier,
  PaymentMethodType,
} from './membershipModels';
import {
  aiFeatures,
  MEMBERSHIP_BEAN_BALANCE,
  MEMBERSHIP_DEDUCTION_AMOUNT,
  MEMBERSHIP_RED_PACKET_COUNTDOWN,
  membershipUserProfile,
  plansFor,
  promoFor,
} from './membershipMockData';
import {
  headerBodyHeight,
  membershipDimens,
  membershipPaletteBase as base,
  membershipPaletteOf,
  tabBarHeightForWidth,
} from './membershipTheme';

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(seconds).padStart(2, '0')}`;
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${normalized}${a}`;
}

function planLayout(maxWidth: number) {
  const design = membershipDimens.planCardWidth;
  const spare = maxWidth - design * 3;
  if (spare >= 0) {
    return {inset: spare / 4, cardWidth: design};
  }
  const minInset = 8;
  return {inset: minInset, cardWidth: (maxWidth - minInset * 4) / 3};
}

function asset(
  key: string,
): (typeof membershipAssets)[keyof typeof membershipAssets] {
  return membershipAssets[key as keyof typeof membershipAssets];
}

/** Flutter `Icons.arrow_back_ios_new` size 18 — not `icon_back.png`. */
function HeaderBackButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.headerBtnHit}>
      <View style={styles.backChevronBox}>
        <View style={styles.backChevron} />
      </View>
    </Pressable>
  );
}

function HeaderIconButton({
  source,
  onPress,
}: {
  source: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.headerBtnHit}>
      <Image source={source} style={styles.headerServiceIcon} />
    </Pressable>
  );
}

export function MembershipRenewScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.payMembership>) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const [tier, setTier] = useState<MembershipTier>('svip');
  const [planId, setPlanId] = useState('svip_12m');
  const [useDeduction, setUseDeduction] = useState(true);
  const [payment, setPayment] = useState<PaymentMethodType>('wechat');
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(MEMBERSHIP_RED_PACKET_COUNTDOWN);
  const [showCollapsedNav, setShowCollapsedNav] = useState(false);
  const secondsRef = useRef(2 * 3600 + 32 * 60 + 59);
  const palette = membershipPaletteOf(tier);
  const plans = plansFor(tier);
  const selectedPlan =
    plans.find(p => p.id === planId) ?? plans[0] ?? svipPlansFallback();
  const promo = promoFor(tier);
  const showAgreement = tier === 'aiSvip';
  const tabHeight = tabBarHeightForWidth(width);
  const {inset, cardWidth} = planLayout(width);

  const finalPrice = useMemo(() => {
    let price = selectedPlan.price;
    if (useDeduction) {
      price -= MEMBERSHIP_DEDUCTION_AMOUNT;
    }
    if (payment === 'wechat') {
      price -= MEMBERSHIP_BEAN_BALANCE;
    }
    return price < 0 ? 0 : Number(price.toFixed(2));
  }, [selectedPlan.price, useDeduction, payment]);

  const navCollapseThreshold =
    insets.top +
    membershipDimens.headerTopPadding +
    membershipDimens.headerActionRowHeight +
    membershipDimens.headerProfileGap +
    membershipDimens.headerAvatarSize;

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsRef.current <= 0) {
        return;
      }
      secondsRef.current -= 1;
      setCountdown(formatCountdown(secondsRef.current));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectTier = (next: MembershipTier) => {
    if (next === tier) {
      return;
    }
    setTier(next);
    setUseDeduction(next === 'svip');
    setAgreed(false);
    const nextPlans = plansFor(next);
    setPlanId(nextPlans[0]?.id ?? planId);
  };

  const renewNow = () => {
    if (showAgreement && !agreed) {
      AppToast.show('请先阅读并同意会员协议');
      return;
    }
    AppToast.show(
      `Mock 续费 ¥${finalPrice.toFixed(2)}（${selectedPlan.title}）`,
    );
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const show = e.nativeEvent.contentOffset.y >= navCollapseThreshold;
    if (show !== showCollapsedNav) {
      setShowCollapsedNav(show);
    }
  };

  const headerHeight = insets.top + headerBodyHeight() + tabHeight;
  const headerBg =
    tier === 'svip'
      ? membershipAssets.header_svip
      : membershipAssets.header_ai_svip;
  const watermark =
    tier === 'svip'
      ? membershipAssets.header_svip_watermark
      : membershipAssets.header_ai_svip_watermark;

  return (
    <AppPageScaffold layout="fullBleed" backgroundColor={base.pageBackground}>
      <View style={styles.root}>
        <ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 180 + insets.bottom}}>
          {/* Header + Tier tabs (Flutter MembershipHeader) */}
          <View style={{height: headerHeight}} key={tier}>
            <Image
              source={headerBg}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <Image
              source={watermark}
              style={[styles.watermark, {top: insets.top}]}
              resizeMode="contain"
            />
            <View style={styles.headerColumn}>
              <View
                style={[
                  styles.headerBody,
                  {
                    paddingTop: insets.top + membershipDimens.headerTopPadding,
                    paddingBottom: membershipDimens.headerBottomPadding,
                  },
                ]}>
                <View style={styles.headerActions}>
                  <HeaderBackButton onPress={() => navigation.goBack()} />
                  <HeaderIconButton
                    source={membershipAssets.icon_service}
                    onPress={() => AppToast.show('客服帮助（开发中）')}
                  />
                </View>
                <View style={styles.profileRow}>
                  <Image
                    source={{uri: membershipUserProfile.avatarUrl}}
                    style={styles.avatar}
                  />
                  <View style={styles.profileMeta}>
                    <View style={styles.nameRow}>
                      <Text style={styles.displayName}>
                        {membershipUserProfile.displayName}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          {backgroundColor: withAlpha(palette.accent, 0.15)},
                        ]}>
                        <Text
                          style={[styles.badgeText, {color: palette.accent}]}>
                          {membershipUserProfile.levelBadge}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.statusText}>
                      {membershipUserProfile.statusText}
                    </Text>
                  </View>
                </View>
              </View>
              <MembershipTierTabs
                tier={tier}
                height={tabHeight}
                onSelect={selectTier}
              />
            </View>
          </View>

          <View style={styles.cardBlock}>
            <View style={[styles.planRow, {paddingHorizontal: inset}]}>
              {plans.map((plan, index) => (
                <View
                  key={plan.id}
                  style={{
                    width: cardWidth,
                    marginLeft: index === 0 ? 0 : inset,
                  }}>
                  <PlanCard
                    plan={plan}
                    selected={plan.id === selectedPlan.id}
                    palette={palette}
                    countdown={countdown}
                    cardWidth={cardWidth}
                    onPress={() => setPlanId(plan.id)}
                  />
                </View>
              ))}
            </View>

            <View
              style={[
                styles.promo,
                {backgroundColor: palette.promoBackground},
              ]}>
              <View style={styles.promoBody}>
                <Text style={[styles.promoTitle, {color: palette.promoAccent}]}>
                  {promo.title}
                </Text>
                <Text style={styles.promoSub}>{promo.subtitle}</Text>
              </View>
              <View style={styles.promoRight}>
                <Text style={styles.promoEndHint}>距结束还剩</Text>
                <Text style={[styles.promoCount, {color: palette.promoAccent}]}>
                  {promo.countdownLabel}
                </Text>
              </View>
            </View>

            {/* Flutter MembershipDeductionRow — always visible */}
            <Pressable
              style={styles.deductionRow}
              onPress={() => setUseDeduction(v => !v)}>
              <Image
                source={asset(palette.illustration)}
                style={styles.deductionIcon}
              />
              <View style={styles.deductionMeta}>
                <Text style={styles.deductionLabel}>
                  剩余会员天数可抵扣{' '}
                  <Text
                    style={[
                      styles.deductionAmount,
                      {color: palette.deductionHighlight},
                    ]}>
                    {MEMBERSHIP_DEDUCTION_AMOUNT} 元
                  </Text>
                </Text>
                <Text style={styles.deductionHint}>
                  SVIP抵扣0.7元/天，VIP抵扣0.3元/天
                </Text>
              </View>
              <Image
                source={
                  useDeduction
                    ? asset(palette.radioSelected)
                    : asset(palette.radioUnselected)
                }
                style={styles.radio22}
              />
            </Pressable>

            <View style={styles.paymentCard}>
              <PaymentRow
                icon={membershipAssets.icon_wechat}
                title="微信支付"
                subtitle={`（趣豆余额抵扣 ${MEMBERSHIP_BEAN_BALANCE.toFixed(
                  2,
                )} 元）`}
                selected={payment === 'wechat'}
                onPress={() => setPayment('wechat')}
              />
              <View style={styles.paymentDivider} />
              <PaymentRow
                icon={membershipAssets.icon_alipay}
                title="支付宝支付"
                selected={payment === 'alipay'}
                onPress={() => setPayment('alipay')}
              />
            </View>
          </View>

          {tier === 'aiSvip' ? (
            <View style={styles.featureSection}>
              <View style={styles.featureTitleRow}>
                <Text style={styles.featureTitle}>AI同步练 校内好提分</Text>
                <View
                  style={[
                    styles.aiExclusiveBadge,
                    {backgroundColor: withAlpha(palette.accent, 0.12)},
                  ]}>
                  <Text
                    style={[styles.aiExclusiveText, {color: palette.accent}]}>
                    AI SVIP 专享
                  </Text>
                </View>
              </View>
              <View style={styles.featureGrid}>
                {aiFeatures.map(item => (
                  <View
                    key={item.title}
                    style={[
                      styles.featureCard,
                      {backgroundColor: item.gradient[0]},
                    ]}>
                    <Text style={styles.featureCardTitle}>{item.title}</Text>
                    <Text style={styles.featureCardSub}>{item.subtitle}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.featureSection}>
              <Text style={styles.featureTitle}>畅享6W+会员内容 系统进阶</Text>
              <Text style={styles.featureSubtitle}>
                精选全球IP 孩子主动要学
              </Text>
              <Image
                source={membershipAssets.illustration_svip}
                style={styles.illustration}
                resizeMode="cover"
              />
            </View>
          )}
        </ScrollView>

        {/* Collapsed nav: avatar + name (not page title) */}
        <View
          pointerEvents={showCollapsedNav ? 'auto' : 'none'}
          style={[
            styles.collapsedNav,
            {
              paddingTop: insets.top,
              opacity: showCollapsedNav ? 1 : 0,
            },
          ]}>
          <View style={styles.collapsedToolbar}>
            <HeaderBackButton onPress={() => navigation.goBack()} />
            <View style={styles.collapsedCenter}>
              <Image
                source={{uri: membershipUserProfile.avatarUrl}}
                style={styles.collapsedAvatar}
              />
              <Text style={styles.collapsedName} numberOfLines={1}>
                {membershipUserProfile.displayName}
              </Text>
            </View>
            <HeaderIconButton
              source={membershipAssets.icon_service}
              onPress={() => AppToast.show('客服帮助（开发中）')}
            />
          </View>
        </View>

        <View style={[styles.renewBar, {paddingBottom: insets.bottom + 12}]}>
          {showAgreement ? (
            <Pressable
              style={styles.agreeRow}
              onPress={() => setAgreed(v => !v)}>
              <Image
                source={
                  agreed
                    ? membershipAssets.icon_checkbox_selected
                    : membershipAssets.icon_checkbox_unselected
                }
                style={styles.checkIcon}
              />
              <Text style={styles.agreeText}>
                已阅读并同意《趣配音会员协议》《趣配音自动续费协议》
              </Text>
            </Pressable>
          ) : null}
          <Pressable onPress={renewNow} style={styles.cta}>
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {backgroundColor: palette.ctaGradient[0]},
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {backgroundColor: palette.ctaGradient[1], opacity: 0.55},
              ]}
            />
            <Text style={styles.ctaText}>
              ¥{finalPrice.toFixed(2)} 立即续费
            </Text>
          </Pressable>
          {!showAgreement ? (
            <Text style={styles.protocolHint}>趣配音会员协议</Text>
          ) : null}
        </View>
      </View>
    </AppPageScaffold>
  );
}

function svipPlansFallback(): MembershipPlan {
  return {
    id: 'svip_12m',
    tier: 'svip',
    title: '12个月',
    price: 380,
    originalPrice: 488,
  };
}

/** Flutter MembershipTierTabs: 三切图背景 + 图标文案叠层 */
function MembershipTierTabs({
  tier,
  height,
  onSelect,
}: {
  tier: MembershipTier;
  height: number;
  onSelect: (tier: MembershipTier) => void;
}) {
  const slices =
    tier === 'svip'
      ? [
          membershipAssets.tab_svip_left,
          membershipAssets.tab_svip_center,
          membershipAssets.tab_svip_right,
        ]
      : [
          membershipAssets.tab_ai_svip_left,
          membershipAssets.tab_ai_svip_center,
          membershipAssets.tab_ai_svip_right,
        ];

  return (
    <View style={[styles.tierTabs, {height}]}>
      <View style={styles.tierBgRow} key={tier}>
        {slices.map((src, i) => (
          <Image
            key={`${tier}-${i}`}
            source={src}
            style={styles.tierSlice}
            resizeMode="cover"
          />
        ))}
      </View>
      <View style={styles.tierTapRow}>
        <TierTapArea
          tier="svip"
          selected={tier === 'svip'}
          icon={membershipAssets.icon_crown_svip}
          title="SVIP"
          titleItalic={false}
          subtitle="6W内容 无限评分"
          onPress={() => onSelect('svip')}
        />
        <TierTapArea
          tier="aiSvip"
          selected={tier === 'aiSvip'}
          icon={membershipAssets.icon_diamond_ai}
          title="Ai"
          titleSuffix=" SVIP"
          titleItalic
          subtitle="SVIP+AI权益"
          onPress={() => onSelect('aiSvip')}
        />
      </View>
    </View>
  );
}

function TierTapArea({
  tier,
  selected,
  icon,
  title,
  titleSuffix,
  titleItalic,
  subtitle,
  onPress,
}: {
  tier: MembershipTier;
  selected: boolean;
  icon: number;
  title: string;
  titleSuffix?: string;
  titleItalic: boolean;
  subtitle: string;
  onPress: () => void;
}) {
  const iconOpacity = selected ? 1 : tier === 'svip' ? 0.65 : 0.55;
  return (
    <Pressable style={styles.tierTap} onPress={onPress}>
      <View style={styles.tierTapInner}>
        <Image
          source={icon}
          style={[styles.tierIcon, {opacity: iconOpacity}]}
          resizeMode="contain"
        />
        <View>
          <Text
            style={[
              styles.tierTitle,
              selected ? styles.tierTitleActive : null,
            ]}>
            <Text style={titleItalic ? styles.tierTitleItalic : null}>
              {title}
            </Text>
            {titleSuffix ?? ''}
          </Text>
          <Text
            style={[styles.tierSub, selected ? styles.tierSubActive : null]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function PlanCard({
  plan,
  selected,
  palette,
  countdown,
  cardWidth,
  onPress,
}: {
  plan: MembershipPlan;
  selected: boolean;
  palette: MembershipPaletteTokens;
  countdown: string;
  cardWidth: number;
  onPress: () => void;
}) {
  const isTrial = plan.badge === '开学尝鲜价';
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.planCard,
          {
            width: cardWidth,
            borderColor: selected
              ? palette.planBorder
              : base.planBorderUnselected,
            borderWidth: selected ? 1.5 : 1,
            backgroundColor: selected ? '#FFF8ED' : base.cardWhite,
          },
        ]}>
        {selected ? (
          <Image
            source={membershipAssets.member_card_bg}
            style={StyleSheet.absoluteFillObject}
            resizeMode="stretch"
          />
        ) : null}
        {plan.badge ? (
          isTrial && selected ? (
            <View
              style={[
                styles.planBadgeTrial,
                {backgroundColor: palette.accent},
              ]}>
              <Text style={styles.planBadgeTrialText}>{plan.badge}</Text>
            </View>
          ) : (
            <View style={styles.planBadgePromo}>
              <Text
                style={[styles.planBadgePromoText, {color: palette.accent}]}>
                {plan.badge}
              </Text>
            </View>
          )
        ) : null}
        <View style={[styles.planContent, {paddingTop: plan.badge ? 22 : 12}]}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <Text style={styles.planPrice}>
            ¥<Text style={styles.planPriceNum}>{plan.price}</Text>
          </Text>
          <Text style={styles.planOriginal}>¥{plan.originalPrice}</Text>
        </View>
        {selected && plan.showRedPacket ? (
          <View
            style={[styles.redPacketFooter, {backgroundColor: palette.accent}]}>
            <Image
              source={asset(palette.redPacketIcon)}
              style={styles.redPacketIcon}
            />
            <Text style={styles.redPacketText} numberOfLines={1}>
              8元红包 {countdown}
            </Text>
          </View>
        ) : !selected && plan.dailyHint ? (
          <View style={styles.dailyHintFooter}>
            <Text style={[styles.dailyHintText, {color: palette.accent}]}>
              {plan.dailyHint}
            </Text>
          </View>
        ) : (
          <View style={{height: selected ? 8 : 10}} />
        )}
      </View>
      {selected ? (
        <View style={[styles.planPointer, {borderTopColor: palette.accent}]} />
      ) : (
        <View style={styles.planPointerSpacer} />
      )}
    </Pressable>
  );
}

function PaymentRow({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}: {
  icon: number;
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.paymentRow} onPress={onPress}>
      <Image source={icon} style={styles.payIcon} />
      <Text style={styles.payTitle}>
        {title}
        {subtitle ? <Text style={styles.paySub}>{subtitle}</Text> : null}
      </Text>
      <Image
        source={
          selected
            ? membershipAssets.icon_check_selected
            : membershipAssets.icon_radio_unselected_svip
        }
        style={styles.radio22}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  watermark: {position: 'absolute', right: 0, width: 140, height: 120},
  headerColumn: {flex: 1, justifyContent: 'space-between'},
  headerBody: {flex: 1, paddingHorizontal: 16},
  headerActions: {
    height: membershipDimens.headerActionRowHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtnHit: {padding: 8},
  backChevronBox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: base.titleBlack,
    transform: [{rotate: '45deg'}],
    marginLeft: 4,
  },
  headerServiceIcon: {width: 22, height: 22},
  profileRow: {
    marginTop: membershipDimens.headerProfileGap,
    height: membershipDimens.headerAvatarSize,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: membershipDimens.headerAvatarSize,
    height: membershipDimens.headerAvatarSize,
    borderRadius: membershipDimens.headerAvatarSize / 2,
  },
  profileMeta: {marginLeft: 12, flex: 1},
  nameRow: {flexDirection: 'row', alignItems: 'center'},
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    color: base.titleBlack,
    lineHeight: 20,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {fontSize: 11, fontWeight: '600', lineHeight: 12},
  statusText: {
    marginTop: 2,
    fontSize: 13,
    color: base.textGray,
    lineHeight: 14,
  },
  tierTabs: {width: '100%', overflow: 'hidden'},
  tierBgRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tierSlice: {flex: 1, height: '100%'},
  tierTapRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tierTap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  tierTapInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIcon: {
    width: membershipDimens.tabIconWidth,
    height: membershipDimens.tabIconHeight,
    marginRight: 6,
  },
  tierTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: base.textGray,
    lineHeight: 16,
  },
  tierTitleActive: {color: base.titleBlack},
  tierTitleItalic: {fontStyle: 'italic'},
  tierSub: {
    fontSize: 8,
    color: base.textGrayLight,
    lineHeight: 10,
    marginTop: 1,
  },
  tierSubActive: {color: base.textGray},
  cardBlock: {backgroundColor: base.cardWhite, paddingBottom: 8},
  planRow: {
    flexDirection: 'row',
    marginTop: 16,
    minHeight:
      membershipDimens.planCardHeight + membershipDimens.planCardPointerHeight,
  },
  planCard: {
    height: membershipDimens.planCardHeight,
    borderRadius: membershipDimens.planCardRadius,
    backgroundColor: base.cardWhite,
    overflow: 'hidden',
  },
  planBadgeTrial: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    paddingLeft: 6,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 4,
    borderTopLeftRadius: membershipDimens.planCardRadius,
    borderBottomRightRadius: 8,
  },
  planBadgeTrialText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  planBadgePromo: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: base.planBadgePromoBg,
  },
  planBadgePromoText: {fontSize: 9, fontWeight: '600'},
  planContent: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {fontSize: 14, color: base.titleBlack, textAlign: 'center'},
  planPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: base.priceBlack,
    textAlign: 'center',
  },
  planPriceNum: {fontSize: 26, fontWeight: '700'},
  planOriginal: {
    marginTop: 2,
    fontSize: 11,
    color: base.originalPriceGray,
    textDecorationLine: 'line-through',
    textAlign: 'center',
  },
  redPacketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  redPacketIcon: {width: 12, height: 12},
  redPacketText: {
    marginLeft: 3,
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    flexShrink: 1,
  },
  dailyHintFooter: {
    paddingVertical: 6,
    backgroundColor: base.planFooterPeach,
    borderBottomLeftRadius: membershipDimens.planCardRadius - 1,
    borderBottomRightRadius: membershipDimens.planCardRadius - 1,
  },
  dailyHintText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '500',
  },
  planPointer: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: membershipDimens.planCardPointerHeight,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  planPointerSpacer: {height: membershipDimens.planCardPointerHeight},
  promo: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoBody: {flex: 1},
  promoTitle: {fontSize: 16, fontWeight: '700'},
  promoSub: {marginTop: 4, fontSize: 12, color: base.textGray},
  promoRight: {alignItems: 'flex-end'},
  promoEndHint: {fontSize: 11, color: base.textGray},
  promoCount: {marginTop: 2, fontSize: 12, fontWeight: '600'},
  deductionRow: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: base.cardWhite,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deductionIcon: {width: 40, height: 40},
  deductionMeta: {flex: 1, marginLeft: 12},
  deductionLabel: {fontSize: 14, color: base.titleBlack, lineHeight: 20},
  deductionAmount: {fontWeight: '700'},
  deductionHint: {marginTop: 4, fontSize: 11, color: base.textGray},
  radio22: {width: 22, height: 22},
  paymentCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: base.cardWhite,
    overflow: 'hidden',
  },
  paymentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EEEEEE',
    marginLeft: 56,
  },
  paymentRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  payIcon: {width: 28, height: 28, marginRight: 12},
  payTitle: {flex: 1, fontSize: 15, color: base.titleBlack},
  paySub: {fontSize: 12, color: base.deductionOrange},
  checkIcon: {width: 18, height: 18},
  featureSection: {paddingHorizontal: 16, paddingTop: 24},
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: base.titleBlack,
  },
  featureSubtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    color: base.textGray,
  },
  aiExclusiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiExclusiveText: {fontSize: 11, fontWeight: '600'},
  featureGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  featureCard: {
    width: '47%',
    borderRadius: 12,
    padding: 12,
    minHeight: 88,
  },
  featureCardTitle: {color: '#fff', fontSize: 16, fontWeight: '700'},
  featureCardSub: {color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 6},
  illustration: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collapsedNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: base.cardWhite,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  collapsedToolbar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  collapsedCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedAvatar: {width: 24, height: 24, borderRadius: 12},
  collapsedName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: base.titleBlack,
    maxWidth: 160,
  },
  renewBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: base.cardWhite,
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: -2},
    elevation: 8,
  },
  agreeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  agreeText: {flex: 1, marginLeft: 8, fontSize: 11, color: base.textGray},
  cta: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    zIndex: 1,
  },
  protocolHint: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 11,
    color: base.textGrayLight,
  },
});
