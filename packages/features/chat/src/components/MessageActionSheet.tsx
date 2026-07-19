import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ImMessage} from '@core/im';
import {canRecallMessage} from '../utils/timeDivider';
import {chatTheme} from '../theme/chatTheme';

interface Props {
  message: ImMessage | null;
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
  onRecall: () => void;
  onDelete: () => void;
  onRetry: () => void;
}

export function MessageActionSheet({
  message,
  visible,
  onClose,
  onCopy,
  onRecall,
  onDelete,
  onRetry,
}: Props) {
  if (!message) {
    return null;
  }

  const showCopy = message.type === 'text';
  const showRecall = message.isSelf && canRecallMessage(message);
  const showRetry = message.sendStatus === 'failed';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          {showCopy ? (
            <Pressable style={styles.action} onPress={onCopy}>
              <Text style={styles.actionText}>复制</Text>
            </Pressable>
          ) : null}
          {showRecall ? (
            <Pressable style={styles.action} onPress={onRecall}>
              <Text style={styles.actionText}>撤回</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.action} onPress={onDelete}>
            <Text style={[styles.actionText, styles.danger]}>删除</Text>
          </Pressable>
          {showRetry ? (
            <Pressable style={styles.action} onPress={onRetry}>
              <Text style={styles.actionText}>重新发送</Text>
            </Pressable>
          ) : null}
          <Pressable style={[styles.action, styles.cancel]} onPress={onClose}>
            <Text style={styles.actionText}>取消</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: chatTheme.surface,
    borderTopLeftRadius: chatTheme.radiusMd,
    borderTopRightRadius: chatTheme.radiusMd,
    paddingBottom: 24,
  },
  action: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: chatTheme.separator,
  },
  cancel: {borderBottomWidth: 0, marginTop: 4},
  actionText: {
    fontSize: 16,
    color: chatTheme.labelPrimary,
    textAlign: 'center',
  },
  danger: {color: chatTheme.unreadBadge},
});
