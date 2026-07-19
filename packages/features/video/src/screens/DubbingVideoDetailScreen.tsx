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
  findDubbingVideo,
  type DubbingAlbumPart,
  type DubbingLeaderboardEntry,
  type DubbingVideoItem,
} from '../dubbing/dubbingMediaMockData';

const PRIMARY = '#52C41A';
const GRAY = '#8C8C8C';
const TITLE = '#1A1A1A';

function isGreenTag(tag: string): boolean {
  return (
    tag === '合作' ||
    tag.startsWith('难度') ||
    tag === '漫威' ||
    tag === '经典大片' ||
    tag === '超级英雄'
  );
}

function formatLike(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return String(count);
}

export function DubbingVideoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.dubbingVideoDetail>) {
  const insets = useSafeAreaInsets();
  const item = findDubbingVideo(route.params?.id);
  const [descExpanded, setDescExpanded] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const activeVideoUrl =
    item?.albumParts[selectedPartIndex]?.videoUrl ?? item?.videoUrl ?? '';

  if (!item) {
    return (
      <AppPageScaffold
        navBar={
          <AppNavBar
            title="视频详情"
            showBackButton
            onBack={() => navigation.goBack()}
          />
        }>
        <View style={styles.center}>
          <Text>视频不存在</Text>
        </View>
      </AppPageScaffold>
    );
  }

  return (
    <AppPageScaffold layout="edgeToEdge" backgroundColor="#FFFFFF">
      <View style={styles.root}>
        <PlayableVideoHeader
          key={activeVideoUrl}
          videoUrl={activeVideoUrl}
          subtitleEn={item.subtitleEn}
          subtitleZh={item.subtitleZh}
          onBack={() => navigation.goBack()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollPad}>
          <TitleSection item={item} />
          <TagsSection tags={item.tags} />
          <DescriptionSection
            desc={item.desc}
            expanded={descExpanded}
            onToggle={() => setDescExpanded(v => !v)}
          />
          <View style={styles.divider} />
          <UploaderSection name={item.uploaderName} />
          <View style={styles.divider} />
          <AlbumSection
            item={item}
            selectedIndex={selectedPartIndex}
            onPartSelected={setSelectedPartIndex}
          />
          <View style={styles.thickDivider} />
          <LatestWorksSection avatars={item.latestWorkAvatars} />
          <View style={styles.thickDivider} />
          {item.leaderboard ? (
            <LeaderboardSection entry={item.leaderboard} />
          ) : null}
        </ScrollView>
        <BottomBar
          bottomInset={insets.bottom}
          onFavorite={() => AppToast.show('已收藏')}
          onShare={() => AppToast.show('分享（开发中）')}
          onStartDubbing={() => AppToast.show('开启配音（开发中）')}
        />
      </View>
    </AppPageScaffold>
  );
}

function TitleSection({item}: {item: DubbingVideoItem}) {
  return (
    <View style={styles.titleRow}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.voteCol}>
        <Text style={styles.likeIcon}>▲</Text>
        <Text style={styles.voteCount}>{item.likeCount}</Text>
        <Text style={styles.dislikeIcon}>▽</Text>
      </View>
    </View>
  );
}

function TagsSection({tags}: {tags: string[]}) {
  return (
    <View style={styles.tags}>
      {tags.map(tag => {
        const green = isGreenTag(tag);
        return (
          <View
            key={tag}
            style={[styles.tag, green ? styles.tagGreen : styles.tagGray]}>
            <Text
              style={[
                styles.tagText,
                green ? styles.tagTextGreen : styles.tagTextGray,
              ]}>
              {tag}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function DescriptionSection({
  desc,
  expanded,
  onToggle,
}: {
  desc: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.descRow} onPress={onToggle}>
      <Text style={styles.desc} numberOfLines={expanded ? undefined : 1}>
        {desc}
      </Text>
      <Text style={styles.chevron}>{expanded ? '∧' : '∨'}</Text>
    </Pressable>
  );
}

function UploaderSection({name}: {name: string}) {
  return (
    <View style={styles.uploaderRow}>
      <View style={styles.uploaderAvatar}>
        <Text style={styles.uploaderAvatarText}>趣</Text>
      </View>
      <Text style={styles.uploaderName}>上传者 {name}</Text>
      <Pressable
        style={styles.rewardPill}
        onPress={() => AppToast.show('打赏（开发中）')}>
        <Text style={styles.rewardText}>🎁 打赏</Text>
      </Pressable>
    </View>
  );
}

function AlbumSection({
  item,
  selectedIndex,
  onPartSelected,
}: {
  item: DubbingVideoItem;
  selectedIndex: number;
  onPartSelected: (index: number) => void;
}) {
  return (
    <View style={styles.albumPad}>
      <View style={styles.albumHeader}>
        <Text style={styles.sectionTitle}>视频专辑 ({item.albumCount})</Text>
        <Text style={styles.sectionChevron}>›</Text>
        <View style={styles.flex} />
        <Pressable onPress={() => AppToast.show('添加学习计划（开发中）')}>
          <Text style={styles.planLink}>+ 添加学习计划</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.albumParts.map((part, index) => (
          <AlbumPartCard
            key={part.id}
            part={part}
            index={index}
            selected={index === selectedIndex}
            isLast={index === item.albumParts.length - 1}
            onPress={() => onPartSelected(index)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function AlbumPartCard({
  part,
  index,
  selected,
  isLast,
  onPress,
}: {
  part: DubbingAlbumPart;
  index: number;
  selected: boolean;
  isLast: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.partCard,
        selected ? styles.partCardSelected : styles.partCardIdle,
        !isLast && styles.partCardGap,
      ]}>
      <View style={styles.partTop}>
        <Text style={styles.partLabel}>Part {index + 1}</Text>
        {part.badge ? (
          <View
            style={[
              styles.partBadge,
              part.badge === '试听'
                ? styles.partBadgeTrial
                : styles.partBadgePaid,
            ]}>
            <Text
              style={[
                styles.partBadgeText,
                part.badge === '试听'
                  ? styles.partBadgeTextTrial
                  : styles.partBadgeTextPaid,
              ]}>
              {part.badge}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.partSpacer} />
      <Text style={styles.partTitle} numberOfLines={2}>
        {part.title}
      </Text>
    </Pressable>
  );
}

function LatestWorksSection({avatars}: {avatars: string[]}) {
  return (
    <View style={styles.albumPad}>
      <View style={styles.albumHeader}>
        <Text style={styles.sectionTitle}>最新作品</Text>
        <Text style={styles.sectionChevron}>›</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {avatars.map((uri, index) => (
          <Image
            key={`${uri}-${index}`}
            source={{uri}}
            style={[styles.workAvatar, index > 0 && styles.workAvatarGap]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function LeaderboardSection({entry}: {entry: DubbingLeaderboardEntry}) {
  return (
    <View style={styles.leaderPad}>
      <Text style={styles.sectionTitle}>点赞榜</Text>
      <View style={styles.leaderRow}>
        <Text style={styles.medal}>🥇</Text>
        <View>
          <Image source={{uri: entry.avatarUrl}} style={styles.leaderAvatar} />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{entry.level}</Text>
          </View>
        </View>
        <View style={styles.leaderMeta}>
          <Text style={styles.leaderName}>{entry.userName}</Text>
          <Text style={styles.leaderSub}>
            {entry.date} · {entry.location}
          </Text>
        </View>
        <Text style={styles.heart}>♥</Text>
        <Text style={styles.voteCount}>{formatLike(entry.likeCount)}</Text>
      </View>
    </View>
  );
}

function BottomBar({
  bottomInset,
  onFavorite,
  onShare,
  onStartDubbing,
}: {
  bottomInset: number;
  onFavorite: () => void;
  onShare: () => void;
  onStartDubbing: () => void;
}) {
  return (
    <View style={[styles.bottomBar, {paddingBottom: 10 + bottomInset}]}>
      <Pressable style={styles.bottomAction} onPress={onFavorite}>
        <Text style={styles.bottomIcon}>☆</Text>
        <Text style={styles.bottomLabel}>收藏</Text>
      </Pressable>
      <Pressable
        style={[styles.bottomAction, styles.shareGap]}
        onPress={onShare}>
        <Text style={styles.bottomIcon}>↗</Text>
        <Text style={styles.bottomLabel}>分享</Text>
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
  scroll: {flex: 1},
  scrollPad: {paddingBottom: 8},
  titleRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: TITLE,
    lineHeight: 23,
  },
  voteCol: {alignItems: 'center', marginLeft: 12},
  likeIcon: {color: '#E85D5D', fontSize: 18, fontWeight: '700'},
  dislikeIcon: {color: GRAY, fontSize: 16, marginTop: 8},
  voteCount: {fontSize: 12, color: GRAY, marginTop: 2},
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagGreen: {backgroundColor: 'rgba(82,196,26,0.12)'},
  tagGray: {backgroundColor: '#F5F5F5'},
  tagText: {fontSize: 11},
  tagTextGreen: {color: PRIMARY},
  tagTextGray: {color: GRAY},
  descRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  desc: {flex: 1, fontSize: 13, color: GRAY},
  chevron: {fontSize: 14, color: GRAY, marginLeft: 4},
  divider: {height: StyleSheet.hairlineWidth, backgroundColor: '#EEEEEE'},
  thickDivider: {height: 8, backgroundColor: '#F5F5F5'},
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  uploaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploaderAvatarText: {color: PRIMARY, fontSize: 14},
  uploaderName: {flex: 1, marginLeft: 10, fontSize: 14, color: TITLE},
  rewardPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFE4EC',
  },
  rewardText: {fontSize: 13, color: '#FF69B4'},
  albumPad: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16},
  albumHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  sectionTitle: {fontSize: 15, fontWeight: '600', color: TITLE},
  sectionChevron: {fontSize: 16, color: GRAY, marginLeft: 2},
  flex: {flex: 1},
  planLink: {fontSize: 13, color: PRIMARY},
  partCard: {
    width: 148,
    height: 108,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  partCardSelected: {borderWidth: 2, borderColor: PRIMARY},
  partCardIdle: {borderWidth: 1, borderColor: '#EEEEEE'},
  partCardGap: {marginRight: 10},
  partTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partLabel: {fontSize: 11, color: GRAY},
  partBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partBadgeTrial: {backgroundColor: 'rgba(82,196,26,0.12)'},
  partBadgePaid: {backgroundColor: '#FFF3E0'},
  partBadgeText: {fontSize: 10},
  partBadgeTextTrial: {color: PRIMARY},
  partBadgeTextPaid: {color: '#FF8A34'},
  partSpacer: {flex: 1},
  partTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: TITLE,
  },
  workAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEE',
  },
  workAvatarGap: {marginLeft: 10},
  leaderPad: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20},
  leaderRow: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  medal: {fontSize: 22, marginRight: 8},
  leaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE',
  },
  levelBadge: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    backgroundColor: '#FFD54F',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  levelText: {fontSize: 9, fontWeight: '600'},
  leaderMeta: {flex: 1, marginLeft: 10},
  leaderName: {fontSize: 14, fontWeight: '500', color: TITLE},
  leaderSub: {fontSize: 12, color: GRAY, marginTop: 2},
  heart: {color: '#E85D5D', fontSize: 16, marginRight: 4},
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
  },
  bottomAction: {alignItems: 'center'},
  shareGap: {marginLeft: 20},
  bottomIcon: {fontSize: 20, color: TITLE},
  bottomLabel: {fontSize: 11, color: GRAY, marginTop: 2},
  startBtn: {
    flex: 1,
    marginLeft: 16,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
});
