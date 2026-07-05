import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import {ShortVideoPageCell} from './ShortVideoPageCell';
import type {
  ShortVideoIndexCallback,
  ShortVideoItem,
  ShortVideoOverlayBuilder,
  ShortVideoPlaybackCallback,
} from './shortVideoModels';

interface ShortVideoFeedViewProps {
  items: ShortVideoItem[];
  initialIndex?: number;
  overlayBuilder?: ShortVideoOverlayBuilder;
  onDoubleTapLike?: ShortVideoIndexCallback;
  onPlaybackEvent?: ShortVideoPlaybackCallback;
}

export function ShortVideoFeedView({
  items,
  initialIndex = 0,
  overlayBuilder,
  onDoubleTapLike,
  onPlaybackEvent,
}: ShortVideoFeedViewProps) {
  const {height} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)),
  );
  const listRef = useRef<FlatList<ShortVideoItem>>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      const first = viewableItems[0];
      if (first?.index != null) {
        setActiveIndex(first.index);
        const item = items[first.index];
        if (item) {
          onPlaybackEvent?.({
            type: 'play',
            index: first.index,
            itemId: item.id,
          });
        }
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const renderItem = useCallback(
    ({item, index}: {item: ShortVideoItem; index: number}) => (
      <View style={{height}}>
        <ShortVideoPageCell
          index={index}
          item={item}
          isActive={index === activeIndex}
          overlay={overlayBuilder?.(index, item)}
          onDoubleTapLike={() => onDoubleTapLike?.(index)}
          onTogglePlayPause={playing => {
            onPlaybackEvent?.({
              type: playing ? 'play' : 'pause',
              index,
              itemId: item.id,
            });
          }}
        />
      </View>
    ),
    [activeIndex, height, onDoubleTapLike, onPlaybackEvent, overlayBuilder],
  );

  if (items.length === 0) {
    return <View style={styles.empty} />;
  }

  return (
    <FlatList
      ref={listRef}
      data={items}
      keyExtractor={entry => entry.id}
      renderItem={renderItem}
      pagingEnabled
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      initialScrollIndex={Math.min(initialIndex, items.length - 1)}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000000',
  },
  empty: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
