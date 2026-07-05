import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {CommentModel} from '../models/commentModel';
import type {PostModel} from '../models/postModel';
import {communityTheme, communityTypography} from '../theme/communityTheme';

interface CommentPreviewProps {
  post: PostModel;
}

function CommentLine({comment}: {comment: CommentModel}) {
  const prefix = comment.replyToNickname
    ? `${comment.nickname} 回复 ${comment.replyToNickname}：`
    : `${comment.nickname}：`;

  return (
    <Text style={communityTypography.commentLine}>
      <Text style={communityTypography.commentPrefix}>{prefix}</Text>
      {comment.content}
    </Text>
  );
}

export function CommentPreview({post}: CommentPreviewProps) {
  if (post.previewComments.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {post.previewComments.map(comment => (
        <View key={comment.id} style={styles.lineWrap}>
          <CommentLine comment={comment} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: communityTheme.commentPreviewMarginTop,
    padding: communityTheme.commentPreviewPadding,
    borderRadius: communityTheme.commentPreviewRadius,
    backgroundColor: communityTheme.commentPreviewBg,
  },
  lineWrap: {
    marginBottom: 4,
  },
});
