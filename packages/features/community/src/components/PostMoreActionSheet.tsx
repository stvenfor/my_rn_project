import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppToast} from '@ui/design-system';
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

function ActionRow({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={[styles.itemText, danger && styles.deleteText]}>
        {label}
      </Text>
    </Pressable>
  );
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
          <ActionRow label="复制文案" onPress={handleCopy} />
          <ActionRow label="举报" onPress={handleReport} />
          {post.isMine ? (
            <ActionRow label="删除" onPress={handleDelete} danger />
          ) : null}
          <ActionRow label="取消" onPress={onClose} />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: communityTheme.surface,
    borderTopLeftRadius: communityTheme.sheetTopRadius,
    borderTopRightRadius: communityTheme.sheetTopRadius,
    paddingBottom: 24,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: communityTheme.separator,
  },
  itemText: {
    fontSize: 16,
    color: communityTheme.labelPrimary,
    textAlign: 'center',
  },
  deleteText: {
    color: communityTheme.likeRed,
  },
});
