import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {DubbingCoverImage} from '../components/DubbingCoverImage';
import {DubbingHotRankCard} from '../components/DubbingHotRankCard';
import {DubbingSectionHeader} from '../components/DubbingSectionHeader';
import {
  buildDubbingHomeFeed,
  type DubbingMediaItem,
} from '../data/dubbingMockData';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

export function HomeDubbingFeedScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeDubbingFeed>) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const hotRankY = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('配音');
  const feed = useMemo(() => buildDubbingHomeFeed(), []);
  const categories = ['SVIP', '配音', '听力', '小剧场', '专题'];

  const openMedia = useCallback(
    (id: string) => {
      navigation.navigate(RoutePath.dubbingVideoDetail, {id});
    },
    [navigation],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 400));
    setRefreshing(false);
  };

  const onHotRankLayout = (e: LayoutChangeEvent) => {
    hotRankY.current = e.nativeEvent.layout.y;
  };

  const scrollToHotRank = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(hotRankY.current - 8, 0),
      animated: true,
    });
  };

  const onFeaturePress = (action?: 'scrollToHotRank' | 'openAllServices') => {
    if (action === 'openAllServices') {
      navigation.navigate(RoutePath.homeAllServices);
      return;
    }
    if (action === 'scrollToHotRank') {
      scrollToHotRank();
    }
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
        <Pressable style={styles.headerIcon} onPress={() => {}}>
          <Image
            source={dubbingHomeAssets.icon_notification}
            style={styles.headerIconImage}
          />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}>
        <View style={styles.catRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cats}>
            {categories.map(item => {
              const active = item === category;
              const svip = item === 'SVIP';
              return (
                <Pressable key={item} onPress={() => setCategory(item)}>
                  <Text
                    style={[
                      styles.cat,
                      svip && styles.catSvip,
                      active && !svip && styles.catActive,
                      active && svip && styles.catSvipActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.menuHit} onPress={() => {}}>
            <Image source={dubbingHomeAssets.icon_menu} style={styles.menu} />
          </Pressable>
        </View>

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
              onPress={() => onFeaturePress(feature.action)}>
              <Image source={feature.icon} style={styles.featureIcon} />
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </Pressable>
          ))}
        </View>

        <DubbingSectionHeader title="最近学习" style="chevron" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feed.recentLearning.map(item => (
            <MediaCard key={item.id} item={item} onPress={openMedia} wide />
          ))}
        </ScrollView>

        <DubbingSectionHeader title="达人秀场" style="refresh" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feed.expertShowcase.map(item => (
            <ExpertCard key={item.id} item={item} onPress={openMedia} />
          ))}
        </ScrollView>

        <View onLayout={onHotRankLayout}>
          <DubbingSectionHeader title="热榜" />
          <View style={styles.hotRankRow}>
            {feed.hotRankBoards.map(board => (
              <DubbingHotRankCard
                key={board.id}
                board={board}
                onViewAll={() =>
                  navigation.navigate(RoutePath.homeHotRankDetail, {
                    boardId: board.id,
                    title: board.title,
                    theme: board.theme,
                  })
                }
                onItemPress={openMedia}
              />
            ))}
          </View>
        </View>

        <DubbingSectionHeader title="编辑精选" style="refresh" />
        <View style={styles.grid}>
          {feed.editorPicks.map(item => (
            <GridCard key={item.id} item={item} onPress={openMedia} />
          ))}
        </View>

        <DubbingSectionHeader
          title="精选专辑"
          subtitle="根据你的学习兴趣为你推荐"
          style="refresh"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feed.albums.map((album, index) => (
            <Pressable
              key={album.id}
              style={styles.album}
              onPress={() => openMedia(album.id)}>
              <View>
                <DubbingCoverImage
                  source={album.cover}
                  width={120}
                  height={152}
                />
                {index === 0 ? (
                  <View style={styles.albumNewBadge}>
                    <Text style={styles.albumNewText}>New</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.mediaTitle}>{album.title}</Text>
              <Text style={styles.boardItemSub}>{album.episodeCount}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <DubbingSectionHeader title="猜你喜欢" style="refresh" />
        <View style={styles.guessRow}>
          {feed.guessYouLike.slice(0, 2).map(item => (
            <Pressable
              key={item.id}
              style={styles.guessCard}
              onPress={() => openMedia(item.id)}>
              <DubbingCoverImage
                source={item.cover}
                width="100%"
                height={110}
                duration={item.duration ?? '02:30'}
              />
              <Text style={styles.guessTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.playCount ? (
                <Text style={styles.boardItemSub}>{item.playCount}播放</Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function MediaCard({
  item,
  onPress,
  wide,
}: {
  item: DubbingMediaItem;
  onPress: (id: string) => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      style={[styles.mediaCard, wide && styles.mediaCardWide]}
      onPress={() => onPress(item.id)}>
      <DubbingCoverImage
        source={item.cover}
        width={wide ? 120 : 110}
        height={wide ? 68 : 78}
        duration={item.duration}
        badge={item.badge}
      />
      <Text style={styles.mediaTitle} numberOfLines={wide ? 2 : 1}>
        {item.title}
      </Text>
    </Pressable>
  );
}

function ExpertCard({
  item,
  onPress,
}: {
  item: DubbingMediaItem;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable style={styles.expertCard} onPress={() => onPress(item.id)}>
      <DubbingCoverImage
        source={item.cover}
        width={150}
        height={96}
        duration="02:30"
      />
      {item.userName ? (
        <View style={styles.expertUserRow}>
          {item.avatar ? (
            <Image source={item.avatar} style={styles.expertAvatar} />
          ) : null}
          <Text style={styles.expertUser} numberOfLines={1}>
            {item.userName}
          </Text>
        </View>
      ) : null}
      <Text style={styles.expertTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.subtitle ? (
        <Text style={styles.boardItemSub} numberOfLines={1}>
          {item.subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

function GridCard({
  item,
  onPress,
}: {
  item: DubbingMediaItem;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable style={styles.gridCard} onPress={() => onPress(item.id)}>
      <DubbingCoverImage
        source={item.cover}
        width="100%"
        height={96}
        badge={item.badge}
      />
      <Text style={styles.expertTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.subtitle ? (
        <Text style={styles.boardItemSub} numberOfLines={1}>
          {item.subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: t.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  back: {width: 44, height: 44, alignItems: 'center', justifyContent: 'center'},
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
  searchIcon: {width: 16, height: 16, marginRight: 8},
  searchPlaceholder: {fontSize: 14, color: t.subtitleGray},
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconImage: {width: 22, height: 22},
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF4D4F',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  cats: {paddingLeft: 16, paddingVertical: 8},
  cat: {marginRight: 24, fontSize: 16, color: t.textGray},
  catActive: {color: t.primaryGreen, fontWeight: '600'},
  catSvip: {color: t.svipGold},
  catSvipActive: {fontWeight: '600'},
  menuHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {width: 22, height: 22},
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
  featureIcon: {width: 52, height: 52},
  featureLabel: {marginTop: 6, fontSize: 12, color: t.titleBlack},
  mediaCard: {width: 110, marginLeft: 16},
  mediaCardWide: {width: 120},
  mediaTitle: {marginTop: 8, fontSize: 12, color: t.titleBlack},
  hotRankRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridCard: {width: '47%'},
  expertCard: {width: 150, marginLeft: 16},
  expertUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expertAvatar: {width: 18, height: 18, borderRadius: 9, marginRight: 6},
  expertUser: {flex: 1, fontSize: 11, color: t.subtitleGray},
  expertTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: t.titleBlack,
  },
  boardItemSub: {fontSize: 11, color: t.subtitleGray, marginTop: 2},
  album: {width: 120, marginLeft: 16},
  albumNewBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  albumNewText: {fontSize: 10, color: '#fff', fontWeight: '600'},
  guessRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 32,
  },
  guessCard: {flex: 1},
  guessTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: t.titleBlack,
    lineHeight: 18,
  },
});
