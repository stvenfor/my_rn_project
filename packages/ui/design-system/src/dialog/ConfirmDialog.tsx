import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

export interface ConfirmDialogProps {
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  maxContentHeight?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: (result?: boolean) => void;
}

/** Aligns with Flutter `ConfirmDialog` — true=确定 / false=取消. */
export function ConfirmDialog({
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  showCloseButton = true,
  maxContentHeight = 300,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView
          style={{maxHeight: maxContentHeight}}
          contentContainerStyle={styles.contentPad}>
          {typeof content === 'string' ? (
            <Text style={styles.body}>{content}</Text>
          ) : (
            content
          )}
        </ScrollView>
        <View style={styles.actions}>
          <Pressable
            style={({pressed}) => [
              styles.cancelBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => {
              onClose(false);
              onCancel?.();
            }}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Pressable>
          <View style={styles.actionGap} />
          <Pressable
            style={({pressed}) => [
              styles.confirmBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => {
              onClose(true);
              onConfirm?.();
            }}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
      {showCloseButton ? (
        <Pressable
          style={styles.closeBtn}
          onPress={() => onClose(false)}
          accessibilityLabel="关闭">
          <Text style={styles.closeGlyph}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  contentPad: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  actions: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  actionGap: {width: 12},
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {opacity: 0.9},
  cancelText: {
    fontSize: 15,
    color: '#666666',
  },
  confirmText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  closeBtn: {
    marginTop: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: -2,
  },
});
