import React from 'react';
import {ShortVideoFeedView} from './ShortVideoFeedView';
import type {
  ShortVideoIndexCallback,
  ShortVideoItem,
  ShortVideoOverlayBuilder,
  ShortVideoPlaybackCallback,
} from './shortVideoModels';

interface ShortVideoPlayerKitSingleProps {
  items: ShortVideoItem[];
  initialIndex: number;
  overlayBuilder?: ShortVideoOverlayBuilder;
  onDoubleTapLike?: ShortVideoIndexCallback;
  onPlaybackEvent?: ShortVideoPlaybackCallback;
}

export const ShortVideoPlayerKit = {
  single({
    items,
    initialIndex,
    overlayBuilder,
    onDoubleTapLike,
    onPlaybackEvent,
  }: ShortVideoPlayerKitSingleProps) {
    return (
      <ShortVideoFeedView
        items={items}
        initialIndex={initialIndex}
        overlayBuilder={overlayBuilder}
        onDoubleTapLike={onDoubleTapLike}
        onPlaybackEvent={onPlaybackEvent}
      />
    );
  },
};
