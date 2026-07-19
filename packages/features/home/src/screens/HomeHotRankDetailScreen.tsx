import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {
  HOT_RANK_AGE_FILTERS,
  HOT_RANK_CATEGORIES,
  buildHotRankDetailItems,
} from '../data/dubbingMockData';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

export function HomeHotRankDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.homeHotRankDetail>) {
  const insets = useSafeAreaInsets();
  const seedTitle = route.params?.title;
  const title = seedTitle === '热度榜' || !seedTitle ? '热搜榜' : seedTitle;
  const [category, setCategory] = useState<string>('热搜榜');
  const [age, setAge] = useState<string>('1-3年级');
  const [showAge, setShowAge] = useState(false);
  const items = useMemo(() => buildHotRankDetailItems(category), [category]);

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <Image
            source={dubbingHomeAssets.hot_rank_wheat_large_left}
            style={styles.wheat}
          />
          <Text style={styles.title}>{title}</Text>
          <Image
            source={dubbingHomeAssets.hot_rank_wheat_large_right}
            style={styles.wheat}
          />
        </View>
        <Image
          source={dubbingHomeAssets.hot_rank_icon_share}
          style={styles.share}
        />
      </View>
      <Text style={styles.subtitle}>趣配音用户近期热搜内容</Text>

      <View style={styles.body}>
        <ScrollView style={styles.sidebar}>
          {HOT_RANK_CATEGORIES.map(item => {
            const active = item === category;
            return (
              <Pressable
                key={item}
                style={[styles.sideItem, active && styles.sideActive]}
                onPress={() => setCategory(item)}>
                <Text
                  style={[styles.sideText, active && styles.sideTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.listPane}>
          <View style={styles.ageBar}>
            <Pressable onPress={() => setShowAge(v => !v)}>
              <Text style={styles.ageText}>{age} ▾</Text>
            </Pressable>
          </View>
          {showAge ? (
            <View style={styles.ageMenu}>
              {HOT_RANK_AGE_FILTERS.map(item => (
                <Pressable
                  key={item}
                  onPress={() => {
                    setAge(item);
                    setShowAge(false);
                  }}>
                  <Text style={styles.ageOption}>{item}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <ScrollView>
            {items.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.item,
                  index < items.length - 1 && styles.itemDivider,
                ]}
                onPress={() =>
                  navigation.navigate(RoutePath.dubbingVideoDetail, {
                    id: item.id,
                  })
                }>
                <Text style={styles.rank}>{item.rank}</Text>
                <Image source={item.cover} style={styles.cover} />
                <View style={styles.flex1}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSub}>
                    {item.subtitle} · {item.heat}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: t.background},
  flex1: {flex: 1},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: t.hotRankHeaderPink,
  },
  back: {width: 44, alignItems: 'center'},
  backText: {fontSize: 28, color: t.titleBlack},
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheat: {width: 28, height: 28},
  title: {
    marginHorizontal: 8,
    fontSize: 22,
    fontWeight: '700',
    color: t.titleBlack,
  },
  share: {width: 22, height: 22, marginRight: 12},
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: t.subtitleGray,
    paddingBottom: 8,
    backgroundColor: t.hotRankHeaderPink,
  },
  body: {flex: 1, flexDirection: 'row'},
  sidebar: {width: 88, backgroundColor: t.hotRankSidebarBg},
  sideItem: {paddingVertical: 14, paddingHorizontal: 8},
  sideActive: {backgroundColor: '#fff', borderTopLeftRadius: 12},
  sideText: {fontSize: 13, color: t.textGray, textAlign: 'center'},
  sideTextActive: {color: t.titleBlack, fontWeight: '700'},
  listPane: {flex: 1, borderTopLeftRadius: 12, overflow: 'hidden'},
  ageBar: {alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8},
  ageText: {fontSize: 13, color: t.textGray},
  ageMenu: {
    position: 'absolute',
    right: 12,
    top: 36,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ageOption: {paddingVertical: 8, paddingHorizontal: 12, color: t.titleBlack},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.divider,
  },
  rank: {width: 28, fontWeight: '700', color: t.titleBlack},
  cover: {width: 48, height: 48, borderRadius: 8, marginRight: 10},
  itemTitle: {fontSize: 14, color: t.titleBlack, fontWeight: '500'},
  itemSub: {marginTop: 4, fontSize: 12, color: t.subtitleGray},
});
