import type {ImageSourcePropType} from 'react-native';
import {dubbingHomeAssets} from '../assets/homeAssets';
import type {HotRankThemeKey} from '../theme/dubbingHomeTheme';

export interface DubbingMediaItem {
  id: string;
  title: string;
  cover: ImageSourcePropType;
  subtitle?: string;
  playCount?: string;
  duration?: string;
  userName?: string;
  badge?: string;
}

export interface DubbingHotRankItem {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  heat: number;
  cover: ImageSourcePropType;
}

export interface DubbingHotRankBoard {
  id: string;
  title: string;
  theme: HotRankThemeKey;
  items: DubbingHotRankItem[];
}

export interface DubbingHomeFeed {
  banners: {id: string; title: string; cover: ImageSourcePropType}[];
  features: {
    label: string;
    icon: ImageSourcePropType;
    action?: 'scrollToHotRank' | 'openAllServices';
  }[];
  recentLearning: DubbingMediaItem[];
  expertShowcase: DubbingMediaItem[];
  hotRankBoards: DubbingHotRankBoard[];
  editorPicks: DubbingMediaItem[];
  albums: {
    id: string;
    title: string;
    cover: ImageSourcePropType;
    episodeCount: string;
  }[];
  guessYouLike: DubbingMediaItem[];
}

function hotItems(prefix: string, count = 10): DubbingHotRankItem[] {
  return Array.from({length: count}, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    rank: i + 1,
    title: `热榜内容 ${i + 1}`,
    subtitle: '热度飙升',
    heat: 9999 - i * 137,
    cover:
      dubbingHomeAssets[
        `cover_${String((i % 12) + 1).padStart(
          2,
          '0',
        )}` as keyof typeof dubbingHomeAssets
      ],
  }));
}

export function buildDubbingHomeFeed(): DubbingHomeFeed {
  return {
    banners: [
      {id: 'b1', title: '主推 Banner', cover: dubbingHomeAssets.banner_main},
      {id: 'b2', title: '测评', cover: dubbingHomeAssets.cover_assessment},
      {id: 'b3', title: '精选', cover: dubbingHomeAssets.cover_01},
    ],
    features: [
      {label: '签到', icon: dubbingHomeAssets.feature_check_in},
      {label: '电影原声', icon: dubbingHomeAssets.feature_movie_words},
      {label: '经典剧场', icon: dubbingHomeAssets.feature_classic_theater},
      {
        label: '热榜',
        icon: dubbingHomeAssets.feature_rank,
        action: 'scrollToHotRank',
      },
      {
        label: '全部视频',
        icon: dubbingHomeAssets.feature_all_videos,
        action: 'openAllServices',
      },
    ],
    recentLearning: [
      {
        id: 'r1',
        title: '最近学习 1',
        cover: dubbingHomeAssets.cover_05,
        duration: '02:30',
      },
      {
        id: 'r2',
        title: '最近学习 2',
        cover: dubbingHomeAssets.cover_06,
        duration: '03:12',
      },
      {
        id: 'r3',
        title: '最近学习 3',
        cover: dubbingHomeAssets.cover_07,
        duration: '01:45',
      },
      {
        id: 'r4',
        title: '最近学习 4',
        cover: dubbingHomeAssets.cover_08,
        duration: '04:01',
      },
    ],
    expertShowcase: [
      {
        id: 'expert_1',
        title: '英语启蒙课堂',
        cover: dubbingHomeAssets.cover_09,
        userName: '蓝儿老师Joyue',
        subtitle: '跟读练习 · 初级',
      },
      {
        id: 'expert_2',
        title: '趣味配音挑战',
        cover: dubbingHomeAssets.cover_10,
        userName: '配音达人',
        subtitle: '动画配音 · 中级',
      },
      {
        id: 'expert_3',
        title: '诵读之星',
        cover: dubbingHomeAssets.cover_11,
        userName: '朗读爱好者',
        subtitle: '经典诵读',
      },
      {
        id: 'expert_4',
        title: '动画配音秀',
        cover: dubbingHomeAssets.cover_12,
        userName: '动画迷',
        subtitle: '角色模仿',
      },
    ],
    hotRankBoards: [
      {id: 'hot_heat', title: '热度榜', theme: 'pink', items: hotItems('heat')},
      {
        id: 'hot_search',
        title: '热搜榜',
        theme: 'blue',
        items: hotItems('search'),
      },
    ],
    editorPicks: [
      {
        id: 'editor_1',
        title: '经典动画配音',
        cover: dubbingHomeAssets.cover_01,
        subtitle: '跟佩奇一起快乐学英语',
        badge: 'AD',
      },
      {
        id: 'editor_2',
        title: '热门影视跟读',
        cover: dubbingHomeAssets.cover_02,
        subtitle: '原声台词练习',
        badge: 'HOT',
      },
      {
        id: 'editor_3',
        title: '少儿启蒙精选',
        cover: dubbingHomeAssets.cover_03,
        subtitle: '分级阅读配套',
      },
    ],
    albums: [
      {
        id: 'a1',
        title: '精选专辑 A',
        cover: dubbingHomeAssets.cover_02,
        episodeCount: '52集',
      },
      {
        id: 'a2',
        title: '精选专辑 B',
        cover: dubbingHomeAssets.cover_03,
        episodeCount: '36集',
      },
      {
        id: 'a3',
        title: '精选专辑 C',
        cover: dubbingHomeAssets.cover_04,
        episodeCount: '24集',
      },
    ],
    guessYouLike: [
      {
        id: 'g1',
        title: '猜你喜欢 1',
        cover: dubbingHomeAssets.cover_09,
        playCount: '6.8万',
      },
      {
        id: 'g2',
        title: '猜你喜欢 2',
        cover: dubbingHomeAssets.cover_10,
        playCount: '3.2万',
      },
      {
        id: 'g3',
        title: '猜你喜欢 3',
        cover: dubbingHomeAssets.cover_11,
        playCount: '1.1万',
      },
    ],
  };
}

export const HOT_RANK_CATEGORIES = [
  '热读榜',
  '新书榜',
  '童话榜',
  '热搜榜',
  '科普榜',
  '高分榜',
] as const;

export const HOT_RANK_AGE_FILTERS = [
  '1-2岁',
  '3岁到大班',
  '1-3年级',
  '4年级以上',
] as const;

export function buildHotRankDetailItems(category: string) {
  return Array.from({length: 20}, (_, i) => ({
    id: `${category}-${i + 1}`,
    rank: i === 3 ? 88 : i + 1,
    title: `${category}内容 ${i + 1}`,
    subtitle: '趣配音热搜',
    heat: 8000 - i * 50,
    cover:
      dubbingHomeAssets[
        `cover_${String((i % 12) + 1).padStart(
          2,
          '0',
        )}` as keyof typeof dubbingHomeAssets
      ],
  }));
}
