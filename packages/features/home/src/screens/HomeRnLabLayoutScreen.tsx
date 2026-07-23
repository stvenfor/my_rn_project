import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {
  RECHARGE_SERVICES,
  RECHARGE_TABS,
  type RechargeService,
} from '../data/rnLabRechargeMockData';
import {RechargeSelectSheet} from '../components/rnLab/RechargeSelectSheet';

const {width: SCREEN_W} = Dimensions.get('window');
const CARD_W = 132;
const CARD_GAP = 12;
const CARD_SIDE = 16;
const SNAP = CARD_W + CARD_GAP;

function clampIndex(index: number): number {
  return Math.max(0, Math.min(RECHARGE_SERVICES.length - 1, index));
}

export function HomeRnLabLayoutScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeRnLabLayout>) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<RechargeService>>(null);
  const tabListRef = useRef<FlatList<RechargeService>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fabPulse = useRef(new Animated.Value(0)).current;
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [index, setIndex] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(
    RECHARGE_SERVICES[0].packages[0]?.id ?? '',
  );
  const [account, setAccount] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [bottomTab, setBottomTab] = useState('home');
  const [sheetVisible, setSheetVisible] = useState(false);

  const service = RECHARGE_SERVICES[index];
  const themeA = service.theme[0];
  const themeB = service.theme[1];

  const headerColor = scrollX.interpolate({
    inputRange: RECHARGE_SERVICES.map((_, i) => i * SNAP),
    outputRange: RECHARGE_SERVICES.map(item => item.theme[0]),
    extrapolate: 'clamp',
  });

  const packages = useMemo(() => {
    if (expanded) {
      return service.packages;
    }
    return service.packages.slice(0, 6);
  }, [expanded, service.packages]);

  useEffect(() => {
    setSelectedPkg(service.packages[0]?.id ?? '');
    setExpanded(false);
    setAccount('');
  }, [service.id, service.packages]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(fabPulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fabPulse]);

  // GIF-like auto carousel demo (pause when user interacts)
  useEffect(() => {
    autoTimer.current = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % RECHARGE_SERVICES.length;
        listRef.current?.scrollToOffset({
          offset: next * SNAP,
          animated: true,
        });
        tabListRef.current?.scrollToIndex({
          index: next,
          animated: true,
          viewPosition: 0.3,
        });
        return next;
      });
    }, 2200);
    return () => {
      if (autoTimer.current) {
        clearInterval(autoTimer.current);
      }
    };
  }, []);

  const stopAuto = () => {
    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = clampIndex(Math.round(e.nativeEvent.contentOffset.x / SNAP));
    setIndex(next);
    tabListRef.current?.scrollToIndex({
      index: next,
      animated: true,
      viewPosition: 0.35,
    });
  };

  const selectIndex = (next: number) => {
    stopAuto();
    const safe = clampIndex(next);
    setIndex(safe);
    listRef.current?.scrollToOffset({offset: safe * SNAP, animated: true});
    tabListRef.current?.scrollToIndex({
      index: safe,
      animated: true,
      viewPosition: 0.35,
    });
  };

  const fabScale = fabPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const fabGlow = fabPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });

  const renderCard = ({
    item,
    index: cardIndex,
  }: ListRenderItemInfo<RechargeService>) => {
    const input = [
      (cardIndex - 1) * SNAP,
      cardIndex * SNAP,
      (cardIndex + 1) * SNAP,
    ];
    const scale = scrollX.interpolate({
      inputRange: input,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange: input,
      outputRange: [0.72, 1, 0.72],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{scale}],
            opacity,
            backgroundColor: cardIndex === index ? '#FFFFFF' : item.sheetTint,
          },
        ]}>
        <View style={[styles.cardIconWrap, {backgroundColor: item.iconBg}]}>
          <Text style={styles.cardIcon}>{item.iconGlyph}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.subtitle}</Text>
        <Text style={styles.cardDiscount}>{item.discount}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: headerColor,
          },
        ]}>
        <View style={styles.navRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.navTitle}>开心果充值中心</Text>
          <View style={styles.capsule}>
            <Text style={styles.capsuleDot}>···</Text>
            <View style={styles.capsuleSplit} />
            <Text style={styles.capsuleClose}>◎</Text>
          </View>
        </View>

        <FlatList
          ref={tabListRef}
          horizontal
          data={RECHARGE_SERVICES}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          onScrollToIndexFailed={() => undefined}
          renderItem={({item, index: tabIndex}) => {
            const active = tabIndex === index;
            return (
              <Pressable
                style={styles.tabItem}
                onPress={() => selectIndex(tabIndex)}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.tabLabel}
                </Text>
              </Pressable>
            );
          }}
        />

        <Animated.FlatList
          ref={listRef}
          horizontal
          data={RECHARGE_SERVICES}
          keyExtractor={item => `card-${item.id}`}
          renderItem={renderCard}
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          contentContainerStyle={{paddingHorizontal: CARD_SIDE}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          onScrollBeginDrag={stopAuto}
          onMomentumScrollEnd={onMomentumEnd}
          getItemLayout={(_, i) => ({
            length: SNAP,
            offset: SNAP * i,
            index: i,
          })}
        />
        <View style={{height: 18}} />
      </Animated.View>

      <View style={[styles.sheet, {backgroundColor: '#FFFFFF'}]}>
        <View style={styles.inputRow}>
          <TextInput
            value={account}
            onChangeText={text => {
              stopAuto();
              setAccount(text);
            }}
            placeholder={service.inputPlaceholder}
            placeholderTextColor="#C7C7CC"
            style={styles.input}
            keyboardType={service.id === 'phone' ? 'phone-pad' : 'default'}
          />
          <Pressable
            style={[styles.contactBtn, {backgroundColor: `${themeA}18`}]}
            onPress={() => AppToast.show('选择联系人 / 账号')}>
            <Text style={[styles.contactGlyph, {color: themeA}]}>
              {service.id === 'phone' ? '👤+' : service.iconGlyph}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>{service.sectionTitle}</Text>
        <View style={styles.grid}>
          {packages.map(pkg => {
            const active = pkg.id === selectedPkg;
            return (
              <Pressable
                key={pkg.id}
                style={[
                  styles.pkg,
                  {
                    borderColor: active ? themeA : '#DCEBFF',
                    backgroundColor: active ? `${themeA}10` : '#fff',
                  },
                ]}
                onPress={() => {
                  stopAuto();
                  setSelectedPkg(pkg.id);
                }}>
                {pkg.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pkg.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.pkgTitle}>{pkg.title}</Text>
                <Text style={styles.pkgPrice}>{pkg.price}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.moreRow}
          onPress={() => {
            stopAuto();
            setExpanded(v => !v);
          }}>
          <Text style={styles.moreText}>
            {expanded ? '收起面额' : '更多面额'}
          </Text>
          <Text style={styles.moreArrow}>{expanded ? '▲' : '▼'}</Text>
        </Pressable>
      </View>

      <View style={[styles.tabBar, {paddingBottom: Math.max(insets.bottom, 8)}]}>
        {RECHARGE_TABS.map(tab => {
          if (tab.id === 'recharge') {
            return (
              <View key={tab.id} style={styles.tabBarItem}>
                <Animated.View
                  style={[
                    styles.fabGlow,
                    {
                      backgroundColor: themeB,
                      opacity: fabGlow,
                      transform: [{scale: fabScale}],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.fab,
                    {
                      backgroundColor: themeA,
                      transform: [{scale: fabScale}],
                    },
                  ]}>
                  <Pressable
                    style={styles.fabInner}
                    onPress={() => {
                      stopAuto();
                      setBottomTab('recharge');
                      setSheetVisible(true);
                    }}>
                    <Text style={styles.fabFace}>充</Text>
                    <View style={styles.fabSmile} />
                  </Pressable>
                </Animated.View>
              </View>
            );
          }
          const active = bottomTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={styles.tabBarItem}
              onPress={() => setBottomTab(tab.id)}>
              <Text style={[styles.tabBarIcon, active && {color: themeA}]}>
                {tab.id === 'home'
                  ? '⌂'
                  : tab.id === 'order'
                    ? '☰'
                    : tab.id === 'discover'
                      ? '◎'
                      : '☺'}
              </Text>
              <Text style={[styles.tabBarLabel, active && {color: themeA}]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <RechargeSelectSheet
        visible={sheetVisible}
        activeId={service.id}
        accent={themeA}
        onClose={() => setSheetVisible(false)}
        onSelect={(item: RechargeService) => {
          const next = RECHARGE_SERVICES.findIndex(s => s.id === item.id);
          if (next >= 0) {
            selectIndex(next);
          }
          setSheetVisible(false);
          AppToast.show(`已选择：${item.tabLabel}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  back: {
    color: '#fff',
    fontSize: 30,
    width: 28,
    lineHeight: 30,
    marginTop: -2,
  },
  navTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 30,
  },
  capsuleDot: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  capsuleSplit: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginHorizontal: 8,
  },
  capsuleClose: {
    color: '#fff',
    fontSize: 14,
  },
  tabRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  tabItem: {
    marginRight: 16,
  },
  tabText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  card: {
    width: CARD_W,
    marginRight: CARD_GAP,
    borderRadius: 18,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
  },
  cardDiscount: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '700',
  },
  sheet: {
    flex: 1,
    marginTop: -12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#1C1C1E',
    paddingVertical: 4,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactGlyph: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pkg: {
    width: (SCREEN_W - 32 - 16) / 3,
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -2,
    backgroundColor: '#FF8A3D',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  pkgTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  pkgPrice: {
    marginTop: 4,
    fontSize: 11,
    color: '#8E8E93',
  },
  moreRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  moreArrow: {
    marginLeft: 4,
    fontSize: 9,
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: -2},
    elevation: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 54,
  },
  tabBarIcon: {
    fontSize: 18,
    color: '#9AA0A6',
  },
  tabBarLabel: {
    marginTop: 2,
    fontSize: 11,
    color: '#9AA0A6',
  },
  fabGlow: {
    position: 'absolute',
    top: -18,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fab: {
    position: 'absolute',
    top: -16,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F9BFF',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 10,
  },
  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabFace: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  fabSmile: {
    width: 16,
    height: 6,
    borderBottomWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    marginTop: -2,
  },
});
