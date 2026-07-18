import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {dubbingHomeAssets, searchAssets} from '../assets/homeAssets';
import {
  SEARCH_PLACEHOLDER,
  SEARCH_RANK_TABS,
  type SearchRankItem,
} from '../data/searchMockData';
import {
  applyTagKeyword,
  bumpRotateIndex,
  clearHistory,
  clearKeyword,
  pushHistory,
  refreshDiscovery,
  selectRotateKeyword,
  selectSearchDiscovery,
  selectSearchFilterTags,
  selectSearchHistory,
  selectSearchKeyword,
  selectSearchRankList,
  selectSearchRankTab,
  selectShowRotatingOverlay,
  setKeyword,
  setRankTab,
  setSearchFocused,
} from '../store/searchSlice';
import {searchPageTheme as t} from '../theme/searchPageTheme';

export function HomeSearchScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeSearch>) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const inputRef = useRef<TextInput>(null);
  const keyword = useSelector(selectSearchKeyword);
  const history = useSelector(selectSearchHistory);
  const discovery = useSelector(selectSearchDiscovery);
  const filters = useSelector(selectSearchFilterTags);
  const rankTab = useSelector(selectSearchRankTab);
  const rankList = useSelector(selectSearchRankList);
  const rotating = useSelector(selectRotateKeyword);
  const showOverlay = useSelector(selectShowRotatingOverlay);

  useEffect(() => {
    if (!showOverlay) {
      return undefined;
    }
    const timer = setInterval(() => dispatch(bumpRotateIndex()), 2000);
    return () => clearInterval(timer);
  }, [dispatch, showOverlay]);

  const currentSearchKeyword = () => {
    const typed = keyword.trim();
    if (typed) {
      return typed;
    }
    if (showOverlay) {
      return rotating;
    }
    return '';
  };

  const submit = (text?: string) => {
    const value =
      text?.trim() || (text === undefined ? currentSearchKeyword() : '').trim();
    if (!value) {
      return;
    }
    dispatch(setKeyword(value));
    dispatch(pushHistory(value));
    AppToast.show(`搜索：${value}`);
  };

  const onTagTap = (tag: string) => {
    dispatch(applyTagKeyword(tag));
    inputRef.current?.focus();
  };

  const onClearKeyword = () => {
    dispatch(clearKeyword());
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="返回">
          <View style={styles.backChevron} />
        </Pressable>

        <View style={styles.field}>
          <Pressable onPress={() => submit()} hitSlop={6}>
            <Image
              source={dubbingHomeAssets.icon_search}
              style={styles.searchIcon}
            />
          </Pressable>
          <View style={styles.inputStack}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={keyword}
              onChangeText={v => dispatch(setKeyword(v))}
              placeholder={SEARCH_PLACEHOLDER}
              placeholderTextColor={t.labelTertiary}
              returnKeyType="search"
              onSubmitEditing={() => submit()}
              onFocus={() => dispatch(setSearchFocused(true))}
              onBlur={() => dispatch(setSearchFocused(false))}
            />
            {showOverlay && rotating ? (
              <View style={styles.overlay} pointerEvents="none">
                <RotatingKeyword keyword={rotating} />
              </View>
            ) : null}
          </View>
          {keyword ? (
            <Pressable onPress={onClearKeyword} hitSlop={8}>
              <Text style={styles.clearGlyph}>✕</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => AppToast.show('语音搜索开发中')}
              hitSlop={8}>
              <Image source={searchAssets.microphone} style={styles.mic} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.cancelBtn}
          hitSlop={8}>
          <Text style={styles.cancel}>取消</Text>
        </Pressable>
      </View>

      {/*
        stickyHeaderIndices={[1]}：第 1 个子节点（榜单 Tab）滚到 ScrollView
        顶部后钉住，等价 Flutter SearchStickyTabBarDelegate / SliverPersistentHeader。
        搜索框在 ScrollView 外，吸顶落点在搜索栏下方。
      */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickyHeaderIndices={[1]}
        contentContainerStyle={{paddingBottom: 24 + insets.bottom}}>
        <View>
          {history.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>搜索历史</Text>
                <Pressable
                  style={styles.clearHistoryBtn}
                  onPress={() => dispatch(clearHistory())}>
                  <Image
                    source={searchAssets.icon_clear_history}
                    style={styles.iconBtn}
                  />
                  <Text style={styles.caption}>清除</Text>
                </Pressable>
              </View>
              <View style={styles.tags}>
                {history.map(item => (
                  <TagChip
                    key={item}
                    label={item}
                    onPress={() => onTagTap(item)}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.historySpacer} />
          )}

          <View style={styles.discoveryCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>搜索发现</Text>
              <Pressable onPress={() => dispatch(refreshDiscovery())}>
                <Image
                  source={searchAssets.icon_refresh}
                  style={[styles.iconBtn, styles.refreshIcon]}
                />
              </Pressable>
              <View style={styles.flexGrow} />
              <Pressable onPress={() => dispatch(refreshDiscovery())}>
                <Text style={styles.caption}>换一换</Text>
              </Pressable>
            </View>
            <View style={styles.tags}>
              {discovery.map((item, index) => (
                <TagChip
                  key={`${item}-${index}`}
                  label={item}
                  highlight={index === 0}
                  onPress={() => onTagTap(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.filterTitleRow}>
              <Text style={styles.sectionTitle}>快捷筛选</Text>
              <Image
                source={searchAssets.icon_filter}
                style={[styles.iconBtn, styles.filterIcon]}
              />
            </View>
            <View style={styles.tags}>
              {filters.map(item => (
                <TagChip
                  key={item}
                  label={item}
                  onPress={() => onTagTap(item)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.stickyTabBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rankTabs}>
            {SEARCH_RANK_TABS.map(tab => {
              const active = tab.key === rankTab;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => dispatch(setRankTab(tab.key))}
                  style={styles.rankTab}>
                  <Text
                    style={[
                      styles.rankTabText,
                      active && styles.rankTabActive,
                    ]}>
                    {tab.label}
                  </Text>
                  <View
                    style={[
                      styles.rankUnderline,
                      !active && styles.rankUnderlineHidden,
                    ]}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.rankCard}>
          {rankList.map((item, index) => (
            <RankListItem
              key={item.id}
              item={item}
              showDivider={index < rankList.length - 1}
              onPress={() => AppToast.show(`打开：${item.title}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TagChip({
  label,
  onPress,
  highlight = false,
}: {
  label: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tag, highlight && styles.tagHighlight]}>
      <Text
        style={[styles.tagText, highlight && styles.tagTextHighlight]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function RotatingKeyword({keyword}: {keyword: string}) {
  const translateY = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(12);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [keyword, opacity, translateY]);

  return (
    <Animated.Text
      numberOfLines={1}
      style={[styles.overlayText, {opacity, transform: [{translateY}]}]}>
      {keyword}
    </Animated.Text>
  );
}

function RankListItem({
  item,
  showDivider,
  onPress,
}: {
  item: SearchRankItem;
  showDivider: boolean;
  onPress: () => void;
}) {
  const rankColor =
    item.rank === 1
      ? t.rankGold
      : item.rank === 2
      ? t.rankSilver
      : item.rank === 3
      ? t.rankBronze
      : t.labelSecondary;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.rankItem}>
        <Text
          style={[
            styles.rankNum,
            item.rank <= 3 && styles.rankNumTop,
            {color: rankColor},
          ]}>
          {item.rank}
        </Text>
        <Image source={{uri: item.coverUrl}} style={styles.rankCover} />
        <View style={styles.rankMeta}>
          <Text style={styles.rankTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rankSub} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </View>
        <Text style={styles.rankChevron}>›</Text>
      </View>
      {showDivider ? <View style={styles.rankDivider} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: t.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: t.accent,
    transform: [{rotate: '45deg'}],
    marginLeft: 4,
  },
  field: {
    flex: 1,
    height: t.searchFieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.separator,
  },
  searchIcon: {width: 18, height: 18, tintColor: t.labelSecondary},
  inputStack: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: t.labelPrimary,
    padding: 0,
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: t.surface,
    justifyContent: 'center',
  },
  overlayText: {fontSize: 16, color: t.labelPrimary},
  clearGlyph: {
    fontSize: 14,
    color: t.labelTertiary,
    paddingHorizontal: 4,
  },
  mic: {width: 20, height: 20, tintColor: t.accent},
  cancelBtn: {marginLeft: 8, paddingHorizontal: 4},
  cancel: {fontSize: 16, color: t.accent},
  section: {paddingHorizontal: 16, paddingBottom: 16},
  historySpacer: {height: 8},
  discoveryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.separator,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  clearHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  caption: {fontSize: 13, color: t.labelSecondary, marginLeft: 4},
  flexGrow: {flex: 1},
  iconBtn: {width: 18, height: 18},
  refreshIcon: {marginLeft: 6, tintColor: t.accent},
  filterIcon: {marginLeft: 6, tintColor: t.accent},
  tags: {flexDirection: 'row', flexWrap: 'wrap'},
  tag: {
    backgroundColor: t.fillSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: '100%',
  },
  tagHighlight: {backgroundColor: 'rgba(0,122,255,0.1)'},
  tagText: {fontSize: 14, color: t.labelPrimary},
  tagTextHighlight: {color: t.accent, fontWeight: '500'},
  stickyTabBar: {
    backgroundColor: t.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(198,198,200,0.6)',
    zIndex: 2,
  },
  rankTabs: {paddingHorizontal: 12, paddingTop: 0, paddingBottom: 8},
  rankTab: {marginRight: 20, alignItems: 'center'},
  rankTabText: {fontSize: 15, color: t.labelSecondary},
  rankTabActive: {color: t.accent, fontWeight: '600'},
  rankUnderline: {
    marginTop: 6,
    width: 20,
    height: 2,
    backgroundColor: t.accent,
  },
  rankUnderlineHidden: {width: 0, backgroundColor: 'transparent'},
  rankCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.separator,
    overflow: 'hidden',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rankDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: t.separator,
    marginLeft: 52,
    marginRight: 16,
  },
  rankNum: {
    width: 24,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  rankNumTop: {fontSize: 16, fontWeight: '700'},
  rankCover: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: t.fillSecondary,
  },
  rankMeta: {flex: 1, paddingRight: 4},
  rankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  rankSub: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: t.labelSecondary,
  },
  rankChevron: {
    fontSize: 22,
    color: t.labelTertiary,
    marginTop: 2,
  },
});
