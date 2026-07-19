import React, {useEffect, useMemo} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ShortVideoPlayerKit, type ShortVideoItem} from '@commons/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {getShortVideoListItems} from '../services/shortVideoMockData';
import {toPlayerItems} from '../services/shortVideoMapper';
import {shortVideoTheme} from '../theme/shortVideoTheme';

function resolveInitialIndex(
  params: RootStackScreenProps<
    typeof RoutePath.shortVideoPlay
  >['route']['params'],
): number {
  if (typeof params?.initialIndex === 'number') {
    return params.initialIndex;
  }
  return 0;
}

function buildTitleOverlay(_index: number, item: ShortVideoItem) {
  const title = item.title;
  if (!title) {
    return null;
  }
  return (
    <View style={styles.titleOverlay} pointerEvents="none">
      <Text style={styles.titleText} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

export function ShortVideoPlayScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.shortVideoPlay>) {
  const insets = useSafeAreaInsets();
  const initialIndex = resolveInitialIndex(route.params);
  const playerItems = useMemo(
    () => toPlayerItems(getShortVideoListItems()),
    [],
  );

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    return () => {
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  if (playerItems.length === 0) {
    return (
      <AppPageScaffold
        layout="edgeToEdge"
        backgroundColor={shortVideoTheme.playScreenBg}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>暂无可播放视频</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.emptyBack}>返回</Text>
          </Pressable>
        </View>
      </AppPageScaffold>
    );
  }

  const index = Math.min(Math.max(initialIndex, 0), playerItems.length - 1);

  return (
    <AppPageScaffold
      layout="edgeToEdge"
      backgroundColor={shortVideoTheme.playScreenBg}>
      <ShortVideoPlayerKit.single
        items={playerItems}
        initialIndex={index}
        overlayBuilder={buildTitleOverlay}
        onDoubleTapLike={() => AppToast.show('点赞（开发中）')}
        onPlaybackEvent={
          __DEV__
            ? event => {
                console.log(
                  `[ShortVideoPlay] ${event.type} #${event.index} ${event.itemId}`,
                );
              }
            : undefined
        }
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="返回"
        style={[
          styles.backButton,
          {top: insets.top + shortVideoTheme.playBackTop},
        ]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backGlyph}>‹</Text>
      </Pressable>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 16,
  },
  emptyBack: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    left: shortVideoTheme.playBackLeft,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  backGlyph: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
  titleOverlay: {
    position: 'absolute',
    left: shortVideoTheme.playTitleLeft,
    right: shortVideoTheme.playTitleRight,
    bottom: shortVideoTheme.playTitleBottom,
    zIndex: 6,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: shortVideoTheme.playTitleSize,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.54)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 6,
  },
});
