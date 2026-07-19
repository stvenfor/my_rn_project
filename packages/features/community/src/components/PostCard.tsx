import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {AppToast} from '@ui/design-system';
import type {PostModel} from '../models/postModel';
import {hasImages, hasVideo} from '../models/postModel';
import {deletePost, type CommunityState} from '../store/communitySlice';
import {CommentPreview} from './CommentPreview';
import {CommentBottomSheet} from './CommentBottomSheet';
import {CommunityEllipsisIcon} from './CommunityIcons';
import {ExpandTextContent} from './ExpandTextContent';
import {ImageGrid} from './ImageGrid';
import {LikeBar} from './LikeBar';
import {PostMoreActionSheet} from './PostMoreActionSheet';
import {UserInfoRow} from './UserInfoRow';
import {VideoCard} from './VideoCard';
import {communityTheme} from '../theme/communityTheme';

type CommunityDispatch = ThunkDispatch<
  {community: CommunityState},
  unknown,
  UnknownAction
>;

interface PostCardProps {
  post: PostModel;
}

export function PostCard({post}: PostCardProps) {
  const dispatch = useDispatch<CommunityDispatch>();
  const [moreVisible, setMoreVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);

  const handleCopy = () => {
    AppToast.show('已复制');
  };

  const handleDelete = (postId: string) => {
    dispatch(deletePost(postId))
      .unwrap()
      .then(() => AppToast.show('已删除'))
      .catch(() => AppToast.show('删除失败'));
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerMain}>
          <UserInfoRow post={post} />
        </View>
        <Pressable
          style={styles.moreButton}
          hitSlop={8}
          onPress={() => setMoreVisible(true)}>
          <CommunityEllipsisIcon size={20} />
        </Pressable>
      </View>

      <View style={styles.sectionGap} />
      <ExpandTextContent post={post} />

      {hasImages(post) ? (
        <>
          <View style={styles.sectionGap} />
          <ImageGrid images={post.images} postId={post.id} />
        </>
      ) : null}

      {hasVideo(post) ? (
        <>
          <View style={styles.sectionGap} />
          <VideoCard videoUrl={post.videoUrl!} coverUrl={post.videoCoverUrl} />
        </>
      ) : null}

      <LikeBar post={post} onCommentPress={() => setCommentVisible(true)} />
      <CommentPreview post={post} />

      <PostMoreActionSheet
        visible={moreVisible}
        post={post}
        onClose={() => setMoreVisible(false)}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
      <CommentBottomSheet
        visible={commentVisible}
        post={post}
        onClose={() => setCommentVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: communityTheme.surface,
    borderRadius: communityTheme.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: communityTheme.separator,
    marginBottom: communityTheme.cardMarginBottom,
    paddingTop: communityTheme.cardPaddingTop,
    paddingBottom: communityTheme.cardPaddingBottom,
    paddingLeft: communityTheme.cardPaddingLeft,
    paddingRight: communityTheme.cardPaddingRight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerMain: {
    flex: 1,
  },
  moreButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionGap: {
    height: communityTheme.sectionGap,
  },
});
