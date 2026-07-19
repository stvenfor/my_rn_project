import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type MainTabScreenProps} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {
  CommunityPlusIcon,
  CommunitySearchIcon,
} from '../components/CommunityIcons';
import {CommunityEmptyState} from '../components/CommunityEmptyState';
import {CommunityErrorState} from '../components/CommunityErrorState';
import {PostCard} from '../components/PostCard';
import {PostSkeletonList} from '../components/PostSkeletonList';
import type {PostModel} from '../models/postModel';
import {
  loadMorePosts,
  loadPosts,
  refreshPosts,
  selectCommunityError,
  selectCommunityHasMore,
  selectCommunityLoading,
  selectCommunityLoadingMore,
  selectCommunityPosts,
  selectCommunityRefreshing,
  type CommunityState,
} from '../store/communitySlice';
import {communityTheme, communityTypography} from '../theme/communityTheme';

type CommunityDispatch = ThunkDispatch<
  {community: CommunityState},
  unknown,
  UnknownAction
>;

const FILTERS = ['最新', '热门', '关注'] as const;

function CommunityHeader({onPublish}: {onPublish: () => void}) {
  const insets = useSafeAreaInsets();
  const [filterIndex, setFilterIndex] = useState(0);

  return (
    <View style={[styles.header, {paddingTop: insets.top + 8}]}>
      <View style={styles.titleRow}>
        <Text style={styles.largeTitle}>社区</Text>
        <Pressable
          style={styles.publishHit}
          onPress={onPublish}
          accessibilityLabel="发布">
          <View style={styles.publishBtn}>
            <CommunityPlusIcon />
          </View>
        </Pressable>
      </View>
      <Pressable style={styles.searchBar} onPress={() => {}}>
        <CommunitySearchIcon />
        <Text style={styles.searchPlaceholder}>搜索动态、话题、用户</Text>
      </Pressable>
      <View style={styles.filterRow}>
        {FILTERS.map((label, index) => {
          const active = index === filterIndex;
          return (
            <Pressable
              key={label}
              style={styles.filterItem}
              onPress={() => setFilterIndex(index)}>
              <Text
                style={[
                  styles.filterText,
                  active ? styles.filterTextActive : styles.filterTextInactive,
                ]}>
                {label}
              </Text>
              <View
                style={[
                  styles.filterUnderline,
                  active && styles.filterUnderlineActive,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CommunityScreen({
  navigation,
}: MainTabScreenProps<'CommunityTab'>) {
  const dispatch = useDispatch<CommunityDispatch>();
  const {width} = useWindowDimensions();
  const posts = useSelector(selectCommunityPosts);
  const loading = useSelector(selectCommunityLoading);
  const refreshing = useSelector(selectCommunityRefreshing);
  const loadingMore = useSelector(selectCommunityLoadingMore);
  const hasMore = useSelector(selectCommunityHasMore);
  const error = useSelector(selectCommunityError);
  const contentMaxWidth =
    width >= 840 ? communityTheme.contentMaxWidth : undefined;

  useEffect(() => {
    dispatch(loadPosts());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    try {
      await dispatch(refreshPosts()).unwrap();
    } catch {
      AppToast.show('刷新失败');
    }
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      dispatch(loadMorePosts())
        .unwrap()
        .catch(() => AppToast.show('加载更多失败'));
    }
  }, [dispatch, hasMore, loading, loadingMore]);

  const renderItem = useCallback(
    ({item}: {item: PostModel}) => <PostCard post={item} />,
    [],
  );

  const openPublish = () => navigation.navigate(RoutePath.communityPublish);

  const shell = (body: React.ReactNode) => (
    <AppPageScaffold
      layout="mainTabRoot"
      backgroundColor={communityTheme.screenBackground}>
      <View
        style={[
          styles.root,
          contentMaxWidth != null && styles.rootConstrained,
          contentMaxWidth != null && {maxWidth: contentMaxWidth},
        ]}>
        <CommunityHeader onPublish={openPublish} />
        {body}
      </View>
    </AppPageScaffold>
  );

  if (loading && posts.length === 0) {
    return shell(
      <View style={styles.listPad}>
        <PostSkeletonList />
      </View>,
    );
  }

  if (error && posts.length === 0) {
    return shell(
      <CommunityErrorState
        message={error}
        onRetry={() => dispatch(loadPosts())}
      />,
    );
  }

  if (posts.length === 0) {
    return shell(
      <CommunityEmptyState refreshing={refreshing} onRefresh={handleRefresh} />,
    );
  }

  return shell(
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listPad}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={communityTheme.accent}
          colors={[communityTheme.accent]}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            color={communityTheme.accent}
            style={styles.footerLoader}
          />
        ) : (
          <View style={styles.listBottom} />
        )
      }
    />,
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, width: '100%'},
  rootConstrained: {alignSelf: 'center'},
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeTitle: {
    flex: 1,
    ...communityTypography.largeTitle,
  },
  publishHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: communityTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: communityTheme.radiusMd,
    backgroundColor: communityTheme.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: communityTheme.separator,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: 8,
    ...communityTypography.caption,
    color: communityTheme.labelTertiary,
  },
  filterRow: {
    height: 36,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 15,
    lineHeight: 20,
  },
  filterTextActive: {
    fontWeight: '600',
    color: communityTheme.labelPrimary,
  },
  filterTextInactive: {
    fontWeight: '400',
    color: communityTheme.labelSecondary,
  },
  filterUnderline: {
    marginTop: 6,
    width: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: communityTheme.accent,
  },
  filterUnderlineActive: {
    width: 20,
  },
  listPad: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerLoader: {paddingVertical: 16},
  listBottom: {height: 16},
});
