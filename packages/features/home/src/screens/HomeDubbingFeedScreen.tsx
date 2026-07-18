import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {buildDubbingHomeFeed} from '../data/dubbingMockData';
import {
  HOT_RANK_THEMES,
  dubbingHomeTheme as t,
} from '../theme/dubbingHomeTheme';

export function HomeDubbingFeedScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeDubbingFeed>) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('配音');
  const feed = useMemo(() => buildDubbingHomeFeed(), []);
  const categories = ['SVIP', '配音', '听力', '小剧场', '专题'];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 400));
    setRefreshing(false);
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Pressable
          style={styles.search}
          onPress={() => navigation.navigate(RoutePath.homeSearch)}>
          <Image
            source={dubbingHomeAssets.icon_search}
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>搜索配音内容</Text>
        </Pressable>
        <Image source={dubbingHomeAssets.icon_menu} style={styles.menu} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cats}>
          {categories.map(item => {
            const active = item === category;
            return (
              <Pressable key={item} onPress={() => setCategory(item)}>
                <Text style={[styles.cat, active && styles.catActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}>
          {feed.banners.map(banner => (
            <Image
              key={banner.id}
              source={banner.cover}
              style={styles.banner}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.featureRow}>
          {feed.features.map(feature => (
            <Pressable
              key={feature.label}
              style={styles.feature}
              onPress={() => {
                if (feature.action === 'openAllServices') {
                  navigation.navigate(RoutePath.homeAllServices);
                }
              }}>
              <Image source={feature.icon} style={styles.featureIcon} />
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>最近学习</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feed.recentLearning.map(item => (
            <View key={item.id} style={styles.mediaCard}>
              <Image source={item.cover} style={styles.mediaCover} />
              <Text style={styles.mediaTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>热榜</Text>
        {feed.hotRankBoards.map(board => {
          const theme = HOT_RANK_THEMES[board.theme];
          return (
            <View
              key={board.id}
              style={[styles.board, {backgroundColor: theme.top}]}>
              <View style={styles.boardHeader}>
                <Text style={styles.boardTitle}>{board.title}</Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate(RoutePath.homeHotRankDetail, {
                      boardId: board.id,
                      title: board.title,
                      theme: board.theme,
                    })
                  }>
                  <Text style={styles.viewAll}>查看全部 ›</Text>
                </Pressable>
              </View>
              {board.items.slice(0, 3).map(item => (
                <View key={item.id} style={styles.boardItem}>
                  <Text style={styles.rank}>{item.rank}</Text>
                  <Image source={item.cover} style={styles.boardCover} />
                  <View style={{flex: 1}}>
                    <Text style={styles.boardItemTitle}>{item.title}</Text>
                    <Text style={styles.boardItemSub}>{item.heat} 热度</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>精选专辑</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feed.albums.map(album => (
            <View key={album.id} style={styles.album}>
              <Image source={album.cover} style={styles.albumCover} />
              <Text style={styles.mediaTitle}>{album.title}</Text>
              <Text style={styles.boardItemSub}>{album.episodeCount}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>猜你喜欢</Text>
        {feed.guessYouLike.map(item => (
          <View key={item.id} style={styles.guessRow}>
            <Image source={item.cover} style={styles.guessCover} />
            <View style={{flex: 1}}>
              <Text style={styles.mediaTitle}>{item.title}</Text>
              <Text style={styles.boardItemSub}>{item.playCount} 播放</Text>
            </View>
          </View>
        ))}
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
  back: {width: 36, alignItems: 'center'},
  backText: {fontSize: 28, color: t.titleBlack},
  search: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.searchFieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {width: 16, height: 16, marginRight: 6},
  searchPlaceholder: {fontSize: 14, color: t.subtitleGray},
  menu: {width: 22, height: 22, marginLeft: 10},
  cats: {paddingHorizontal: 16, paddingVertical: 8},
  cat: {marginRight: 18, fontSize: 15, color: t.textGray},
  catActive: {color: t.primaryGreen, fontWeight: '700', fontSize: 17},
  bannerScroll: {marginTop: 4},
  banner: {
    width: 340,
    height: 140,
    marginLeft: 16,
    borderRadius: t.cardRadius,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  feature: {alignItems: 'center', width: '18%'},
  featureIcon: {width: 44, height: 44},
  featureLabel: {marginTop: 6, fontSize: 12, color: t.titleBlack},
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    fontSize: t.sectionTitleSize,
    fontWeight: '700',
    color: t.titleBlack,
  },
  mediaCard: {width: 110, marginLeft: 16},
  mediaCover: {width: 110, height: 78, borderRadius: 8},
  mediaTitle: {marginTop: 6, fontSize: 13, color: t.titleBlack},
  board: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: t.cardRadius,
    padding: 12,
  },
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  boardTitle: {fontSize: 16, fontWeight: '700', color: t.titleBlack},
  viewAll: {fontSize: 13, color: t.textGray},
  boardItem: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  rank: {width: 22, fontWeight: '700', color: t.titleBlack},
  boardCover: {width: 44, height: 44, borderRadius: 8, marginRight: 8},
  boardItemTitle: {fontSize: 14, color: t.titleBlack},
  boardItemSub: {fontSize: 12, color: t.subtitleGray, marginTop: 2},
  album: {width: 120, marginLeft: 16},
  albumCover: {width: 120, height: 120, borderRadius: 8},
  guessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  guessCover: {width: 72, height: 72, borderRadius: 8, marginRight: 12},
});
