import React, {useState} from 'react';
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
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {PlayableVideoHeader} from '../components/dubbing/PlayableVideoHeader';
import {
  findDubbingWork,
  getDubbingWorks,
  type DubbingWorkItem,
} from '../dubbing/dubbingMediaMockData';

const PRIMARY = '#52C41A';
const GRAY = '#8C8C8C';
const BG = '#F5F5F5';

export function DubbingWorkDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.dubbingWorkDetail>) {
  const insets = useSafeAreaInsets();
  const item = findDubbingWork(route.params?.id);
  const [tab, setTab] = useState<'intro' | 'comments'>('intro');

  if (!item) {
    return (
      <AppPageScaffold
        navBar={
          <AppNavBar
            title="作品详情"
            showBackButton
            onBack={() => navigation.goBack()}
          />
        }>
        <View style={styles.center}>
          <Text>作品不存在</Text>
        </View>
      </AppPageScaffold>
    );
  }

  const moreWorks = getDubbingWorks()
    .filter(w => w.id !== item.id)
    .slice(0, 2);

  return (
    <AppPageScaffold layout="edgeToEdge" backgroundColor={BG}>
      <View style={styles.root}>
        <PlayableVideoHeader
          videoUrl={item.videoUrl}
          showWatermark={false}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.tabBar}>
          <Pressable style={styles.tabItem} onPress={() => setTab('intro')}>
            <Text
              style={[
                styles.tabText,
                tab === 'intro' ? styles.tabActive : styles.tabInactive,
              ]}>
              简介
            </Text>
            {tab === 'intro' ? <View style={styles.tabIndicator} /> : null}
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => setTab('comments')}>
            <Text
              style={[
                styles.tabText,
                tab === 'comments' ? styles.tabActive : styles.tabInactive,
              ]}>
              评论 {item.commentCount}
            </Text>
            {tab === 'comments' ? <View style={styles.tabIndicator} /> : null}
          </Pressable>
        </View>
        {tab === 'intro' ? (
          <ScrollView contentContainerStyle={styles.introPad}>
            <IntroTab
              item={item}
              moreWorks={moreWorks}
              onOpenWork={id =>
                navigation.navigate(RoutePath.dubbingWorkDetail, {id})
              }
            />
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.introPad}>
            <CommentsTab />
          </ScrollView>
        )}
        <WorkBottomBar
          bottomInset={insets.bottom}
          likeCount={item.likeCount}
          onStartDubbing={() => AppToast.show('开启配音（开发中）')}
        />
      </View>
    </AppPageScaffold>
  );
}

function IntroTab({
  item,
  moreWorks,
  onOpenWork,
}: {
  item: DubbingWorkItem;
  moreWorks: DubbingWorkItem[];
  onOpenWork: (id: string) => void;
}) {
  return (
    <View>
      <View style={styles.authorRow}>
        <Image source={{uri: item.authorAvatar}} style={styles.avatar} />
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.authorSub}>{item.location} · 粉丝1.5K</Text>
        </View>
        <Pressable style={styles.followBtn}>
          <Text style={styles.followText}>已关注</Text>
        </Pressable>
      </View>
      <View style={styles.titleRow}>
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
        <Text style={styles.workTitle}>{item.title}</Text>
      </View>
      <Text style={styles.time}>{item.publishedAt} 12:09</Text>
      <Text style={styles.alsoDubbed}>99+ 人也配了这个视频</Text>
      <Text style={styles.moreTitle}>Ta的更多作品</Text>
      {moreWorks.map(work => (
        <Pressable
          key={work.id}
          style={styles.moreCard}
          onPress={() => onOpenWork(work.id)}>
          <Image source={{uri: work.coverUrl}} style={styles.moreCover} />
          <View style={styles.moreMeta}>
            {work.badge ? (
              <Text style={styles.moreBadge}>{work.badge}</Text>
            ) : null}
            <Text style={styles.moreWorkTitle} numberOfLines={2}>
              {work.title}
            </Text>
            <Text style={styles.moreLikes}>△ {work.likeCount}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function CommentsTab() {
  return (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        <Text>B</Text>
      </View>
      <View>
        <Text style={styles.commentName}>乌克丽丽</Text>
        <Text style={styles.commentBody}>发音标准，继续加油</Text>
      </View>
    </View>
  );
}

function WorkBottomBar({
  bottomInset,
  likeCount,
  onStartDubbing,
}: {
  bottomInset: number;
  likeCount: number;
  onStartDubbing: () => void;
}) {
  return (
    <View style={[styles.bottomBar, {paddingBottom: 10 + bottomInset}]}>
      <Text style={styles.bottomIcon}>△</Text>
      <Text style={styles.bottomCount}>{likeCount}</Text>
      <Pressable
        style={styles.shareWrap}
        onPress={() => AppToast.show('分享（开发中）')}>
        <Text style={styles.bottomIcon}>↗</Text>
        <Text style={styles.bottomCount}>分享</Text>
      </Pressable>
      <Pressable style={styles.startBtn} onPress={onStartDubbing}>
        <Text style={styles.startText}>开启配音</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {fontSize: 15, fontWeight: '500'},
  tabActive: {color: PRIMARY},
  tabInactive: {color: GRAY},
  tabIndicator: {
    marginTop: 6,
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: PRIMARY,
  },
  introPad: {padding: 16, paddingBottom: 24},
  authorRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEE'},
  authorMeta: {flex: 1, marginLeft: 10},
  authorName: {fontSize: 15, fontWeight: '600', color: '#1A1A1A'},
  authorSub: {fontSize: 12, color: GRAY, marginTop: 2},
  followBtn: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followText: {fontSize: 12, color: PRIMARY},
  titleRow: {flexDirection: 'row', marginTop: 16, alignItems: 'flex-start'},
  badge: {
    marginRight: 6,
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,105,180,0.12)',
  },
  badgeText: {fontSize: 10, color: '#FF69B4'},
  workTitle: {flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A'},
  time: {marginTop: 8, fontSize: 12, color: GRAY},
  alsoDubbed: {marginTop: 16, fontSize: 13, color: GRAY},
  moreTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  moreCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  moreCover: {
    width: 80,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#EEE',
  },
  moreMeta: {flex: 1, marginLeft: 10},
  moreBadge: {fontSize: 10, color: '#FF8A34', marginBottom: 2},
  moreWorkTitle: {fontSize: 13, color: '#1A1A1A'},
  moreLikes: {marginTop: 4, fontSize: 11, color: GRAY},
  commentRow: {flexDirection: 'row', alignItems: 'flex-start'},
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentName: {fontSize: 14, fontWeight: '600', color: '#1A1A1A'},
  commentBody: {marginTop: 4, fontSize: 13, color: GRAY},
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
  },
  bottomIcon: {fontSize: 18, color: '#1A1A1A'},
  bottomCount: {fontSize: 12, color: '#1A1A1A', marginLeft: 4},
  shareWrap: {flexDirection: 'row', alignItems: 'center', marginLeft: 16},
  startBtn: {
    flex: 1,
    marginLeft: 16,
    height: 44,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {color: '#FFFFFF', fontSize: 15, fontWeight: '600'},
});
