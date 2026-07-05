import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppToast, colors} from '@ui/design-system';
import type {PostModel} from '../models/postModel';
import {copyToClipboard} from '../utils/clipboard';
import {communityTheme} from '../theme/communityTheme';

interface PostMoreActionSheetProps {
  visible: boolean;
  post: PostModel | null;
  onClose: () => void;
  onCopy: (post: PostModel) => void;
  onDelete: (postId: string) => void;
}

export function PostMoreActionSheet({
  visible,
  post,
  onClose,
  onCopy,
  onDelete,
}: PostMoreActionSheetProps) {
  if (!post) {
    return null;
  }

  const handleCopy = async () => {
    onClose();
    await copyToClipboard(post.content);
    onCopy(post);
  };

  const handleReport = () => {
    onClose();
    AppToast.show('举报已提交');
  };

  const handleDelete = () => {
    onClose();
    onDelete(post.id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Pressable style={styles.item} onPress={handleCopy}>
            <Text style={styles.itemText}>复制文案</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={handleReport}>
            <Text style={styles.itemText}>举报</Text>
          </Pressable>
          {post.isMine ? (
            <Pressable style={styles.item} onPress={handleDelete}>
              <Text style={styles.deleteText}>删除</Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlayDark,
  },
  sheet: {
    backgroundColor: communityTheme.cardBackground,
    paddingBottom: 24,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: communityTheme.dividerColor,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  deleteText: {
    fontSize: 16,
    color: colors.error,
  },
});
