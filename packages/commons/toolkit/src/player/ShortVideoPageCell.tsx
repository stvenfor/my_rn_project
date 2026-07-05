import React from 'react';
import {isNativeVideoAvailable} from './isNativeVideoAvailable';
import type {ShortVideoItem} from './shortVideoModels';

interface ShortVideoPageCellProps {
  index: number;
  item: ShortVideoItem;
  isActive: boolean;
  overlay?: React.ReactNode;
  onDoubleTapLike?: () => void;
  onTogglePlayPause?: (playing: boolean) => void;
}

export function ShortVideoPageCell(props: ShortVideoPageCellProps) {
  if (isNativeVideoAvailable()) {
    const {ShortVideoNativePageCell} =
      require('./ShortVideoNativePageCell') as typeof import('./ShortVideoNativePageCell');
    return <ShortVideoNativePageCell {...props} />;
  }

  const {ShortVideoWebViewPageCell} =
    require('./ShortVideoWebViewPageCell') as typeof import('./ShortVideoWebViewPageCell');
  return <ShortVideoWebViewPageCell {...props} />;
}
