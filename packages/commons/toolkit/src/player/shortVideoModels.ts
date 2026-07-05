import type React from 'react';

export interface ShortVideoItem {
  id: string;
  url: string;
  coverUrl?: string;
  title?: string;
  aspectRatio?: number;
}

export type PlaybackEventType =
  | 'play'
  | 'pause'
  | 'complete'
  | 'seek'
  | 'error'
  | 'networkReconnect';

export interface PlaybackEvent {
  type: PlaybackEventType;
  index: number;
  itemId: string;
  message?: string;
}

export type ShortVideoOverlayBuilder = (
  index: number,
  item: ShortVideoItem,
) => React.ReactNode;

export type ShortVideoIndexCallback = (index: number) => void;
export type ShortVideoPlaybackCallback = (event: PlaybackEvent) => void;
