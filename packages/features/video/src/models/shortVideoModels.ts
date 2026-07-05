export type ShortVideoCellType = 'publish' | 'video';

export type ShortVideoStatus = 'normal' | 'reviewing' | 'uploading';

export interface ShortVideoItemModel {
  type: ShortVideoCellType;
  id?: string;
  title?: string;
  coverUrl?: string | null;
  videoUrl?: string;
  viewCount?: number;
  duration?: string;
  aspectRatio: number;
  status: ShortVideoStatus;
}

export interface ShortVideoStatsModel {
  videoCount: string;
  viewCount: string;
  likeCount: string;
}

export const SHORT_VIDEO_STATS_EMPTY: ShortVideoStatsModel = {
  videoCount: '0',
  viewCount: '0',
  likeCount: '0',
};

export const SHORT_VIDEO_STATS_DEMO: ShortVideoStatsModel = {
  videoCount: '105',
  viewCount: '282',
  likeCount: '66',
};

export interface ShortVideoProfileModel {
  displayName: string;
  avatarUrl?: string | null;
  roleBadge: string;
  storeName: string;
  stats: ShortVideoStatsModel;
}

export function isPublishItem(item: ShortVideoItemModel): boolean {
  return item.type === 'publish';
}
