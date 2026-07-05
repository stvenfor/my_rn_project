import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import type {User} from '@core/domain';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast, ListRow} from '@ui/design-system';
import {ShortVideoEmptyState} from '../components/shortVideo/ShortVideoEmptyState';
import {ShortVideoMasonryGrid} from '../components/shortVideo/ShortVideoGridTiles';
import {ShortVideoProfileCard} from '../components/shortVideo/ShortVideoProfileCard';
import {
  ShortVideoLoadingFooter,
  ShortVideoSectionHeader,
} from '../components/shortVideo/ShortVideoSectionHeader';
import type {ShortVideoItemModel} from '../models/shortVideoModels';
import {
  SHORT_VIDEO_STATS_DEMO,
  SHORT_VIDEO_STATS_EMPTY,
} from '../models/shortVideoModels';
import {getShortVideoListItems} from '../services/shortVideoMockData';
import {indexForModelId} from '../services/shortVideoMapper';
import {shortVideoTheme} from '../theme/shortVideoTheme';

function selectAuthUser(state: Record<string, unknown>): User | null {
  const auth = state.auth as {user: User | null} | undefined;
  return auth?.user ?? null;
}

export function VideoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.video>) {
  return (
    <AppPageScaffold
      navBar={
        <AppNavBar
          title="视频"
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={videoStyles.body}>
        <Text style={videoStyles.placeholder}>Video 模块</Text>
        <ListRow
          title="小视频"
          subtitle="进入我的小视频"
          onPress={() => navigation.navigate(RoutePath.shortVideo)}
        />
      </View>
    </AppPageScaffold>
  );
}

export function ShortVideoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.shortVideo>) {
  const user = useSelector(selectAuthUser);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const listItems = useMemo(() => getShortVideoListItems(), []);

  const profile = useMemo(() => {
    const stats = showEmptyState
      ? SHORT_VIDEO_STATS_EMPTY
      : SHORT_VIDEO_STATS_DEMO;
    return {
      displayName:
        user?.displayName && user.displayName.length > 0
          ? user.displayName
          : '东东枪',
      avatarUrl:
        user?.avatar && user.avatar.length > 0
          ? user.avatar
          : shortVideoTheme.defaultAvatarUrl,
      roleBadge: '销售经理',
      storeName: '[4S] 北京沃德龙鼎吉利',
      stats,
    };
  }, [showEmptyState, user]);

  const toast = (message: string) => AppToast.show(message);

  const playVideo = (item: ShortVideoItemModel) => {
    if (item.status === 'reviewing') {
      toast('视频审核中，暂不可播放');
      return;
    }
    if (item.status === 'uploading') {
      toast('视频上传中，请稍后再试');
      return;
    }
    const initialIndex = indexForModelId(listItems, item.id ?? '');
    navigation.navigate(RoutePath.shortVideoPlay, {initialIndex});
  };

  return (
    <AppPageScaffold
      backgroundColor={shortVideoTheme.screenBg}
      navBar={
        <AppNavBar
          title="小视频"
          showBackButton
          backgroundColor={shortVideoTheme.navBarBg}
          onBack={() => navigation.goBack()}
          right={
            __DEV__ ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowEmptyState(current => !current)}
                style={styles.devToggle}>
                <Text style={styles.devToggleText}>
                  {showEmptyState ? '▦' : '▣'}
                </Text>
              </Pressable>
            ) : undefined
          }
        />
      }>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.gradientHeader}>
          <ShortVideoProfileCard profile={profile} />
        </View>
        {showEmptyState ? (
          <ShortVideoEmptyState
            onShootTap={() => toast('拍摄小视频（开发中）')}
            onHelpTap={() => toast('如何拍摄小视频（开发中）')}
          />
        ) : (
          <>
            <ShortVideoSectionHeader
              onHelpTap={() => toast('如何拍摄小视频（开发中）')}
            />
            <ShortVideoMasonryGrid
              items={listItems}
              onItemPress={playVideo}
              onItemLongPress={() => toast('长按删除（开发中）')}
              onPublishPress={() => toast('发布小视频（开发中）')}
            />
            <ShortVideoLoadingFooter />
          </>
        )}
      </ScrollView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: shortVideoTheme.screenBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  gradientHeader: {
    backgroundColor: shortVideoTheme.gradientTop,
    paddingBottom: 4,
  },
  devToggle: {
    minWidth: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devToggleText: {
    fontSize: 18,
    color: shortVideoTheme.textPrimary,
  },
});

const videoStyles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    textAlign: 'center',
    marginBottom: 16,
    color: shortVideoTheme.textSecondary,
  },
});
