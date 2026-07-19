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
import {HotRankSidebarItem} from '../components/HotRankSidebarItem';
import {
  HOT_RANK_AGE_FILTERS,
  HOT_RANK_CATEGORIES,
  buildHotRankDetailItems,
} from '../data/dubbingMockData';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

const RANK_COLORS: Record<number, string> = {
  1: '#FFC107',
  2: '#CFD8DC',
  3: '#FFCCBC',
};

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
            style={styles.wheatLarge}
          />
          <Text style={styles.title}>{title}</Text>
          <Image
            source={dubbingHomeAssets.hot_rank_wheat_large_right}
            style={styles.wheatLarge}
          />
        </View>
        <Pressable style={styles.shareHit} onPress={() => {}}>
          <Image
            source={dubbingHomeAssets.hot_rank_icon_share}
            style={styles.share}
          />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>趣配音用户近期热搜内容</Text>

      <View style={styles.body}>
        <ScrollView
          style={styles.sidebar}
          contentContainerStyle={styles.sidebarContent}>
          {HOT_RANK_CATEGORIES.map(item => (
            <HotRankSidebarItem
              key={item}
              label={item}
              active={item === category}
              onPress={() => setCategory(item)}
            />
          ))}
        </ScrollView>

        <View style={styles.listPane}>
          <View style={styles.ageBar}>
            <Pressable
              style={styles.ageChip}
              onPress={() => setShowAge(v => !v)}>
              <Text style={styles.ageText}>{age}</Text>
              <Text style={styles.ageCaret}>{showAge ? '▴' : '▾'}</Text>
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
            {items.map((item, index) => {
              const rankBg = RANK_COLORS[item.rank] ?? '#BDBDBD';
              const rankTextColor = item.rank <= 3 ? '#fff' : t.textGray;
              return (
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
                  <Image source={item.cover} style={styles.cover} />
                  <View style={[styles.rankBadge, {backgroundColor: rankBg}]}>
                    <Text style={[styles.rankText, {color: rankTextColor}]}>
                      {item.rank}
                    </Text>
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSub}>
                      {item.subtitle} · 热度{item.heat}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: t.hotRankHeaderPink,
  },
  back: {width: 44, height: 44, alignItems: 'center', justifyContent: 'center'},
  backText: {fontSize: 28, color: t.titleBlack},
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheatLarge: {width: 28, height: 36},
  title: {
    marginHorizontal: 8,
    fontSize: 22,
    fontWeight: '700',
    color: t.titleBlack,
  },
  shareHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  share: {width: 22, height: 22},
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: t.subtitleGray,
    paddingBottom: 8,
    backgroundColor: t.hotRankHeaderPink,
  },
  body: {flex: 1, flexDirection: 'row'},
  sidebar: {width: 88, backgroundColor: t.hotRankSidebarBg},
  sidebarContent: {paddingTop: 8, paddingBottom: 24},
  listPane: {flex: 1, borderTopLeftRadius: 12, overflow: 'hidden'},
  ageBar: {alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10},
  ageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.divider,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ageText: {fontSize: 12, color: t.titleBlack},
  ageCaret: {marginLeft: 4, fontSize: 12, color: t.subtitleGray},
  ageMenu: {
    position: 'absolute',
    right: 12,
    top: 44,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 4,
    minWidth: 120,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ageOption: {paddingVertical: 12, paddingHorizontal: 12, color: t.titleBlack},
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.divider,
  },
  cover: {width: 56, height: 56, borderRadius: 8},
  rankBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginTop: 2,
  },
  rankText: {fontSize: 11, fontWeight: '700', lineHeight: 12},
  itemTitle: {fontSize: 14, color: t.titleBlack, fontWeight: '600'},
  itemSub: {marginTop: 4, fontSize: 12, color: t.subtitleGray},
});
