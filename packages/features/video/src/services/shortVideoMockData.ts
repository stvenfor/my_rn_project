import {VIDEO_MOCK_SOURCES, shortVideoCoverAt} from '@commons/toolkit';
import type {ShortVideoItemModel} from '../models/shortVideoModels';

const ASPECT_RATIOS = [1.3, 0.85, 1.15];

export function getShortVideoListItems(): ShortVideoItemModel[] {
  const sources = VIDEO_MOCK_SOURCES;
  return [
    {
      type: 'publish',
      aspectRatio: 1.45,
      status: 'normal',
    },
    ...sources.map((source, index) => ({
      type: 'video' as const,
      id: `${source.id}`,
      title: source.title,
      coverUrl: source.coverUrl ?? shortVideoCoverAt(index),
      videoUrl: source.url,
      viewCount: 1200 + index * 337,
      duration: `${1 + index}:${10 + index * 5}`,
      aspectRatio: ASPECT_RATIOS[index % ASPECT_RATIOS.length],
      status: 'normal' as const,
    })),
  ];
}
