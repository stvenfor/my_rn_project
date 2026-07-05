import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import type {ShortVideoItemModel} from '../../models/shortVideoModels';
import {shortVideoTheme} from '../../theme/shortVideoTheme';

interface ShortVideoItemTileProps {
  item: ShortVideoItemModel;
  columnWidth: number;
  onPress: () => void;
  onLongPress: () => void;
}

export function ShortVideoItemTile({
  item,
  columnWidth,
  onPress,
  onLongPress,
}: ShortVideoItemTileProps) {
  const height = columnWidth * item.aspectRatio;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tile, {width: columnWidth, height}]}>
      {item.coverUrl ? (
        <Image
          source={{uri: item.coverUrl}}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.playPlaceholder}>▶</Text>
        </View>
      )}
      {item.status === 'uploading' ? (
        <View style={styles.uploadingOverlay}>
          <Text style={styles.uploadingIcon}>↻</Text>
        </View>
      ) : null}
      {item.status === 'reviewing' ? (
        <View style={styles.reviewingBadge}>
          <Text style={styles.reviewingText}>审核中</Text>
        </View>
      ) : null}
      <View style={styles.bottomGradient}>
        <View style={styles.bottomGradientBg} />
        <Text style={styles.title} numberOfLines={2}>
          {item.title ?? ''}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>▶</Text>
          <Text style={styles.metaText}>{item.viewCount ?? 0}</Text>
          <View style={styles.metaSpacer} />
          <Text style={styles.metaText}>{item.duration ?? ''}</Text>
        </View>
      </View>
    </Pressable>
  );
}

interface ShortVideoPublishTileProps {
  aspectRatio: number;
  columnWidth: number;
  onPress: () => void;
}

export function ShortVideoPublishTile({
  aspectRatio,
  columnWidth,
  onPress,
}: ShortVideoPublishTileProps) {
  const height = columnWidth * aspectRatio;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.publishTile, {width: columnWidth, height}]}>
      <View style={styles.publishInner}>
        <View style={styles.publishIconCircle}>
          <Text style={styles.publishIcon}>+</Text>
        </View>
        <Text style={styles.publishTitle}>发布小视频</Text>
        <Text style={styles.publishHint}>
          拍视频，增加人气（长按已发布小视频可删除）
        </Text>
      </View>
    </Pressable>
  );
}

interface ShortVideoMasonryGridProps {
  items: ShortVideoItemModel[];
  onItemPress: (item: ShortVideoItemModel) => void;
  onItemLongPress: (item: ShortVideoItemModel) => void;
  onPublishPress: () => void;
}

export function ShortVideoMasonryGrid({
  items,
  onItemPress,
  onItemLongPress,
  onPublishPress,
}: ShortVideoMasonryGridProps) {
  const [columnWidth, setColumnWidth] = React.useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    const gap = shortVideoTheme.gridGap;
    setColumnWidth((width - gap) / shortVideoTheme.gridColumns);
  };

  const {leftColumn, rightColumn} = React.useMemo(() => {
    if (columnWidth <= 0) {
      return {leftColumn: [] as ShortVideoItemModel[], rightColumn: []};
    }
    const left: ShortVideoItemModel[] = [];
    const right: ShortVideoItemModel[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    for (const item of items) {
      const itemHeight = columnWidth * item.aspectRatio;
      if (leftHeight <= rightHeight) {
        left.push(item);
        leftHeight += itemHeight + shortVideoTheme.gridGap;
      } else {
        right.push(item);
        rightHeight += itemHeight + shortVideoTheme.gridGap;
      }
    }

    return {leftColumn: left, rightColumn: right};
  }, [columnWidth, items]);

  const renderColumnItem = (item: ShortVideoItemModel) => {
    if (item.type === 'publish') {
      return (
        <View key="publish" style={{marginBottom: shortVideoTheme.gridGap}}>
          <ShortVideoPublishTile
            aspectRatio={item.aspectRatio}
            columnWidth={columnWidth}
            onPress={onPublishPress}
          />
        </View>
      );
    }

    return (
      <View
        key={item.id ?? item.title}
        style={{marginBottom: shortVideoTheme.gridGap}}>
        <ShortVideoItemTile
          item={item}
          columnWidth={columnWidth}
          onPress={() => onItemPress(item)}
          onLongPress={() => onItemLongPress(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.gridRoot} onLayout={onLayout}>
      <View style={styles.column}>{leftColumn.map(renderColumnItem)}</View>
      <View style={styles.columnGap} />
      <View style={styles.column}>{rightColumn.map(renderColumnItem)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridRoot: {
    flexDirection: 'row',
    paddingHorizontal: shortVideoTheme.gridPaddingH,
    paddingBottom: shortVideoTheme.gridPaddingBottom,
  },
  column: {
    flex: 1,
  },
  columnGap: {
    width: shortVideoTheme.gridGap,
  },
  tile: {
    borderRadius: shortVideoTheme.tileRadius,
    overflow: 'hidden',
    backgroundColor: shortVideoTheme.coverPlaceholder,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: shortVideoTheme.coverPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPlaceholder: {
    fontSize: 48,
    color: 'rgba(255,255,255,0.54)',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: shortVideoTheme.uploadingOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingIcon: {
    fontSize: 36,
    color: shortVideoTheme.textSecondary,
  },
  reviewingBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: shortVideoTheme.reviewingBadgeBg,
    borderRadius: shortVideoTheme.badgeRadius,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reviewingText: {
    color: '#FFFFFF',
    fontSize: shortVideoTheme.tileReviewBadgeSize,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  bottomGradientBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: shortVideoTheme.tileTitleSize,
    fontWeight: '500',
    lineHeight: shortVideoTheme.tileTitleSize * 1.3,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaIcon: {
    fontSize: shortVideoTheme.tilePlayIconSize,
    color: 'rgba(255,255,255,0.7)',
    marginRight: 2,
  },
  metaText: {
    fontSize: shortVideoTheme.tileMetaSize,
    color: 'rgba(255,255,255,0.7)',
  },
  metaSpacer: {
    flex: 1,
  },
  publishTile: {
    borderRadius: shortVideoTheme.tileRadius,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: shortVideoTheme.primaryLight,
    overflow: 'hidden',
  },
  publishInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: shortVideoTheme.publishPadding,
  },
  publishIconCircle: {
    width: shortVideoTheme.publishIconCircle,
    height: shortVideoTheme.publishIconCircle,
    borderRadius: shortVideoTheme.publishIconCircle / 2,
    backgroundColor: shortVideoTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishIcon: {
    fontSize: shortVideoTheme.publishIconSize,
    color: '#FFFFFF',
    lineHeight: shortVideoTheme.publishIconSize + 4,
  },
  publishTitle: {
    marginTop: 12,
    fontSize: shortVideoTheme.publishTitleSize,
    fontWeight: '600',
    color: shortVideoTheme.primary,
  },
  publishHint: {
    marginTop: 8,
    fontSize: shortVideoTheme.publishHintSize,
    color: shortVideoTheme.textMuted,
    textAlign: 'center',
    lineHeight: shortVideoTheme.publishHintSize * 1.4,
  },
});
