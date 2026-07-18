import React, {useEffect, useMemo} from 'react';
import {
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
import {searchAssets} from '../assets/homeAssets';
import {SEARCH_RANK_TABS} from '../data/searchMockData';
import {
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
  setKeyword,
  setRankTab,
} from '../store/searchSlice';
import {searchPageTheme as t} from '../theme/searchPageTheme';

export function HomeSearchScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeSearch>) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const keyword = useSelector(selectSearchKeyword);
  const history = useSelector(selectSearchHistory);
  const discovery = useSelector(selectSearchDiscovery);
  const filters = useSelector(selectSearchFilterTags);
  const rankTab = useSelector(selectSearchRankTab);
  const rankList = useSelector(selectSearchRankList);
  const rotating = useSelector(selectRotateKeyword);

  useEffect(() => {
    const timer = setInterval(() => dispatch(bumpRotateIndex()), 2000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const placeholder = useMemo(
    () => rotating || '搜索客户、订单、课程、视频',
    [rotating],
  );

  const submit = (text?: string) => {
    const value = (text ?? (keyword || rotating)).trim();
    if (!value) {
      return;
    }
    dispatch(setKeyword(value));
    dispatch(pushHistory(value));
    AppToast.show(`搜索：${value}`);
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            value={keyword}
            onChangeText={v => dispatch(setKeyword(v))}
            placeholder={placeholder}
            placeholderTextColor={t.labelTertiary}
            returnKeyType="search"
            onSubmitEditing={() => submit()}
          />
          {keyword ? (
            <Pressable onPress={() => dispatch(clearKeyword())}>
              <Text style={styles.clear}>×</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => AppToast.show('语音搜索开发中')}>
              <Image source={searchAssets.microphone} style={styles.mic} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>取消</Text>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 24 + insets.bottom}}>
        {history.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>搜索历史</Text>
              <Pressable onPress={() => dispatch(clearHistory())}>
                <Image
                  source={searchAssets.icon_clear_history}
                  style={styles.iconBtn}
                />
              </Pressable>
            </View>
            <View style={styles.tags}>
              {history.map(item => (
                <Pressable
                  key={item}
                  style={styles.tag}
                  onPress={() => {
                    dispatch(setKeyword(item));
                    dispatch(pushHistory(item));
                  }}>
                  <Text style={styles.tagText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={{height: 8}} />
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>搜索发现</Text>
            <Pressable onPress={() => dispatch(refreshDiscovery())}>
              <Image
                source={searchAssets.icon_refresh}
                style={styles.iconBtn}
              />
            </Pressable>
          </View>
          <View style={styles.tags}>
            {discovery.map(item => (
              <Pressable
                key={item}
                style={styles.tag}
                onPress={() => {
                  dispatch(setKeyword(item));
                  dispatch(pushHistory(item));
                }}>
                <Text style={styles.tagText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>筛选</Text>
            <Image source={searchAssets.icon_filter} style={styles.iconBtn} />
          </View>
          <View style={styles.tags}>
            {filters.map(item => (
              <View key={item} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

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
                  style={[styles.rankTabText, active && styles.rankTabActive]}>
                  {tab.label}
                </Text>
                {active ? <View style={styles.rankUnderline} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.rankCard}>
          {rankList.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.rankItem,
                index < rankList.length - 1 && styles.rankDivider,
              ]}
              onPress={() => AppToast.show(`打开：${item.title}`)}>
              <Text
                style={[
                  styles.rankNum,
                  item.rank === 1 && {color: t.rankGold},
                  item.rank === 2 && {color: t.rankSilver},
                  item.rank === 3 && {color: t.rankBronze},
                ]}>
                {item.rank}
              </Text>
              <Image source={{uri: item.coverUrl}} style={styles.rankCover} />
              <View style={{flex: 1}}>
                <Text style={styles.rankTitle}>{item.title}</Text>
                <Text style={styles.rankSub}>{item.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: t.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backBtn: {width: 32, alignItems: 'center'},
  backText: {fontSize: 28, color: t.labelPrimary, lineHeight: 32},
  field: {
    flex: 1,
    height: t.searchFieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: 0.5,
    borderColor: t.separator,
  },
  input: {flex: 1, fontSize: 15, color: t.labelPrimary, padding: 0},
  clear: {fontSize: 22, color: t.labelSecondary, paddingHorizontal: 4},
  mic: {width: 22, height: 22},
  cancel: {marginLeft: 10, fontSize: 15, color: t.accent},
  section: {paddingHorizontal: 16, paddingTop: 12},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 17, fontWeight: '600', color: t.labelPrimary},
  iconBtn: {width: 20, height: 20},
  tags: {flexDirection: 'row', flexWrap: 'wrap'},
  tag: {
    backgroundColor: t.fillSecondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {fontSize: 13, color: t.labelPrimary},
  rankTabs: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8},
  rankTab: {marginRight: 20, alignItems: 'center'},
  rankTabText: {fontSize: 15, color: t.labelSecondary},
  rankTabActive: {color: t.labelPrimary, fontWeight: '600'},
  rankUnderline: {
    marginTop: 6,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: t.accent,
  },
  rankCard: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    overflow: 'hidden',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rankDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.separator,
  },
  rankNum: {
    width: 24,
    fontSize: 16,
    fontWeight: '700',
    color: t.labelSecondary,
  },
  rankCover: {width: 48, height: 48, borderRadius: 8, marginRight: 10},
  rankTitle: {fontSize: 15, color: t.labelPrimary, fontWeight: '500'},
  rankSub: {marginTop: 4, fontSize: 12, color: t.labelSecondary},
});
