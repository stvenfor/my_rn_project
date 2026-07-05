import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type MainTabScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast, colors} from '@ui/design-system';
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
} from '../store/communitySlice';
import {communityTheme} from '../theme/communityTheme';

type CommunityDispatch = ThunkDispatch<
  {community: unknown},
  unknown,
  UnknownAction
>;

function PublishHeaderButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel="发布">
      <Text style={styles.headerActionIcon}>⊕</Text>
    </Pressable>
  );
}

export function CommunityScreen({
  navigation,
}: MainTabScreenProps<'CommunityTab'>) {
  const dispatch = useDispatch<CommunityDispatch>();
  const posts = useSelector(selectCommunityPosts);
  const loading = useSelector(selectCommunityLoading);
  const refreshing = useSelector(selectCommunityRefreshing);
  const loadingMore = useSelector(selectCommunityLoadingMore);
  const hasMore = useSelector(selectCommunityHasMore);
  const error = useSelector(selectCommunityError);

  const navBar = (
    <AppNavBar
      title="社区"
      right={
        <PublishHeaderButton
          onPress={() => navigation.navigate(RoutePath.communityPublish)}
        />
      }
    />
  );

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

  if (loading && posts.length === 0) {
    return (
      <AppPageScaffold
        navBar={navBar}
        backgroundColor={communityTheme.screenBackground}>
        <PostSkeletonList />
      </AppPageScaffold>
    );
  }

  if (error && posts.length === 0) {
    return (
      <AppPageScaffold
        navBar={navBar}
        backgroundColor={communityTheme.screenBackground}>
        <CommunityErrorState
          message={error}
          onRetry={() => dispatch(loadPosts())}
        />
      </AppPageScaffold>
    );
  }

  if (posts.length === 0) {
    return (
      <AppPageScaffold
        navBar={navBar}
        backgroundColor={communityTheme.screenBackground}>
        <CommunityEmptyState
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </AppPageScaffold>
    );
  }

  return (
    <AppPageScaffold
      navBar={navBar}
      backgroundColor={communityTheme.screenBackground}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              color={colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
      />
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  headerActionIcon: {
    fontSize: 24,
    color: colors.text,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
