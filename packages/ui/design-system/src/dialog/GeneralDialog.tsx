import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

export interface GeneralDialogProps {
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  showCloseButton?: boolean;
  maxContentHeight?: number;
  onConfirm?: () => void;
  onClose: (result?: unknown) => void;
}

/** Aligns with Flutter `GeneralDialog`. */
export function GeneralDialog({
  title,
  content,
  confirmText = '好的，我知道了',
  showCloseButton = true,
  maxContentHeight = 300,
  onConfirm,
  onClose,
}: GeneralDialogProps) {
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
        <Pressable
          style={({pressed}) => [
            styles.confirmBtn,
            pressed && styles.confirmPressed,
          ]}
          onPress={() => {
            onClose(undefined);
            onConfirm?.();
          }}>
          <Text style={styles.confirmText}>{confirmText}</Text>
        </Pressable>
      </View>
      {showCloseButton ? (
        <Pressable
          style={styles.closeBtn}
          onPress={() => onClose(undefined)}
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
  confirmBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPressed: {
    opacity: 0.9,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '500',
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
