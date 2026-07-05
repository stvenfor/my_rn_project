import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {InputPanelMode} from '../store/chatDetailSlice';
import {chatTheme} from '../theme/chatTheme';
import {EmojiPanel} from './EmojiPanel';
import {MorePanel} from './MorePanel';

interface Props {
  mode: InputPanelMode;
  text: string;
  isRecording: boolean;
  recordSeconds: number;
  panelVisible: boolean;
  onChangeText: (value: string) => void;
  onToggleVoice: () => void;
  onToggleEmoji: () => void;
  onToggleMore: () => void;
  onSend: () => void;
  onAppendEmoji: (emoji: string) => void;
  onPickGallery: () => void;
  onPickCamera: () => void;
  onStartRecord: () => void;
  onStopRecord: (send: boolean) => void;
}

export function InputPanel({
  mode,
  text,
  isRecording,
  recordSeconds,
  panelVisible,
  onChangeText,
  onToggleVoice,
  onToggleEmoji,
  onToggleMore,
  onSend,
  onAppendEmoji,
  onPickGallery,
  onPickCamera,
  onStartRecord,
  onStopRecord,
}: Props) {
  const trimmed = text.trim();
  const isVoice = mode === 'voice';
  const showEmoji = mode === 'emoji';
  const showMore = mode === 'more';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={styles.wrap}>
        <View style={styles.toolbar}>
          <Pressable onPress={onToggleVoice} style={styles.iconBtn}>
            <Text style={styles.icon}>{isVoice ? '⌨' : '🎤'}</Text>
          </Pressable>
          {isVoice ? (
            <Pressable
              style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]}
              onPressIn={onStartRecord}
              onPressOut={() => onStopRecord(true)}>
              <Text
                style={[
                  styles.voiceText,
                  isRecording && styles.voiceTextActive,
                ]}>
                {isRecording ? `松开发送 ${recordSeconds}s` : '按住 说话'}
              </Text>
            </Pressable>
          ) : (
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={onChangeText}
              placeholder="输入消息..."
              placeholderTextColor={chatTheme.textHint}
              multiline
              onSubmitEditing={onSend}
            />
          )}
          {!isVoice && trimmed.length === 0 ? (
            <>
              <Pressable onPress={onToggleEmoji} style={styles.iconBtn}>
                <Text style={styles.icon}>😊</Text>
              </Pressable>
              <Pressable onPress={onToggleMore} style={styles.iconBtn}>
                <Text style={styles.icon}>＋</Text>
              </Pressable>
            </>
          ) : null}
          {!isVoice && trimmed.length > 0 ? (
            <Pressable style={styles.sendBtn} onPress={onSend}>
              <Text style={styles.sendText}>发送</Text>
            </Pressable>
          ) : null}
        </View>
        {panelVisible && !isVoice ? (
          showEmoji ? (
            <EmojiPanel onPick={onAppendEmoji} />
          ) : showMore ? (
            <MorePanel
              onPickGallery={onPickGallery}
              onPickCamera={onPickCamera}
            />
          ) : null
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {backgroundColor: chatTheme.panelBackground},
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 22, color: chatTheme.iconMuted},
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: chatTheme.inputBorder,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: chatTheme.titleBlack,
  },
  voiceBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: chatTheme.inputBorder,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnActive: {
    backgroundColor: chatTheme.wechatGreen,
    borderColor: chatTheme.wechatGreen,
  },
  voiceText: {fontSize: 15, color: chatTheme.titleBlack},
  voiceTextActive: {color: '#FFFFFF'},
  sendBtn: {
    marginLeft: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: chatTheme.wechatGreen,
  },
  sendText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
});
