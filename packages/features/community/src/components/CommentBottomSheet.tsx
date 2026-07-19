import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {AppToast} from '@ui/design-system';
import type {CommentModel} from '../models/commentModel';
import type {PostModel} from '../models/postModel';
import {
  fetchComments,
  sendComment,
  type CommunityState,
} from '../store/communitySlice';
import {communityTheme, communityTypography} from '../theme/communityTheme';

type CommunityDispatch = ThunkDispatch<
  {community: CommunityState},
  unknown,
  UnknownAction
>;

interface CommentBottomSheetProps {
  visible: boolean;
  post: PostModel | null;
  onClose: () => void;
}

export function CommentBottomSheet({
  visible,
  post,
  onClose,
}: CommentBottomSheetProps) {
  const dispatch = useDispatch<CommunityDispatch>();
  const {height} = useWindowDimensions();
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const sheetMaxHeight = height * 0.92;
  const listMaxHeight = height * 0.5;

  useEffect(() => {
    if (!visible || !post) {
      return;
    }
    setLoading(true);
    setInput('');
    setReplyTo(null);
    dispatch(fetchComments(post.id))
      .unwrap()
      .then(result => setComments(result.comments))
      .finally(() => setLoading(false));
  }, [visible, post, dispatch]);

  const handleSend = async () => {
    if (!post) {
      return;
    }
    const text = input.trim();
    if (!text) {
      return;
    }
    try {
      await dispatch(
        sendComment({
          postId: post.id,
          content: text,
          replyToNickname: replyTo ?? undefined,
        }),
      ).unwrap();
      setInput('');
      setReplyTo(null);
      const result = await dispatch(fetchComments(post.id)).unwrap();
      setComments(result.comments);
      AppToast.show('评论成功');
    } catch {
      AppToast.show('评论失败');
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheet, {maxHeight: sheetMaxHeight}]}
            onPress={e => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={[communityTypography.sheetTitle, styles.title]}>
              评论 {post.commentCount}
            </Text>
            <View style={[styles.listArea, {maxHeight: listMaxHeight}]}>
              {loading ? (
                <ActivityIndicator
                  color={communityTheme.accent}
                  style={styles.center}
                />
              ) : comments.length === 0 ? (
                <Text style={styles.empty}>暂无评论，快来抢沙发</Text>
              ) : (
                <ScrollView>
                  {comments.map(comment => (
                    <View key={comment.id} style={styles.commentRow}>
                      <Image
                        source={{uri: comment.avatar}}
                        style={styles.avatar}
                      />
                      <View style={styles.commentBody}>
                        <Text style={styles.nickname}>{comment.nickname}</Text>
                        <Text style={styles.commentText}>
                          {comment.replyToNickname
                            ? `回复 ${comment.replyToNickname}：${comment.content}`
                            : comment.content}
                        </Text>
                      </View>
                      <Pressable onPress={() => setReplyTo(comment.nickname)}>
                        <Text style={styles.replyButton}>回复</Text>
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={replyTo ? `回复 ${replyTo}` : '写评论…'}
                placeholderTextColor={communityTheme.labelTertiary}
              />
              <Pressable style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendIcon}>↑</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: communityTheme.surface,
    borderTopLeftRadius: communityTheme.sheetTopRadius,
    borderTopRightRadius: communityTheme.sheetTopRadius,
    minHeight: '40%',
    paddingBottom: 12,
  },
  handle: {
    alignSelf: 'center',
    width: communityTheme.sheetHandleWidth,
    height: communityTheme.sheetHandleHeight,
    borderRadius: communityTheme.sheetHandleRadius,
    backgroundColor: communityTheme.sheetHandleColor,
    marginTop: 8,
  },
  title: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listArea: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 180,
    paddingHorizontal: 8,
  },
  center: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    color: communityTheme.labelSecondary,
    marginTop: 40,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: communityTheme.fillSecondary,
  },
  commentBody: {
    flex: 1,
    marginHorizontal: 10,
  },
  nickname: {
    fontWeight: '600',
    color: communityTheme.labelPrimary,
    marginBottom: 2,
  },
  commentText: {
    color: communityTheme.labelPrimary,
    lineHeight: 20,
  },
  replyButton: {
    color: communityTheme.accent,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: communityTheme.separator,
    borderRadius: communityTheme.inputBorderRadius,
    backgroundColor: communityTheme.fillSecondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: communityTheme.labelPrimary,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: communityTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
