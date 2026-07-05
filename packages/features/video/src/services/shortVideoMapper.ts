import type {ShortVideoItem} from '@commons/toolkit';
import type {ShortVideoItemModel} from '../models/shortVideoModels';
import {isPublishItem} from '../models/shortVideoModels';

export function playableShortVideoItems(
  items: ShortVideoItemModel[],
): ShortVideoItemModel[] {
  return items.filter(
    item =>
      !isPublishItem(item) &&
      item.status === 'normal' &&
      Boolean(item.videoUrl?.length),
  );
}

export function toPlayerItems(items: ShortVideoItemModel[]): ShortVideoItem[] {
  return playableShortVideoItems(items).map(item => ({
    id: item.id ?? '',
    url: item.videoUrl!,
    coverUrl: item.coverUrl ?? undefined,
    title: item.title,
    aspectRatio: item.aspectRatio,
  }));
}

export function indexForModelId(
  items: ShortVideoItemModel[],
  id: string,
): number {
  const playable = playableShortVideoItems(items);
  const index = playable.findIndex(item => item.id === id);
  return index < 0 ? 0 : index;
}
