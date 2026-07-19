import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {InputPanelMode} from '../store/chatDetailSlice';
import {chatTheme, chatTypography} from '../theme/chatTheme';
import {
  ChatKeyboardIcon,
  ChatMicIcon,
  ChatPlusIcon,
  ChatSendArrowIcon,
  ChatSmileIcon,
} from './ChatIcons';
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
  onKeyboardOpen?: () => void;
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
  onKeyboardOpen,
}: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const recordingRef = useRef(false);
  const trimmed = text.trim();
  const isVoice = mode === 'voice';
  const showEmoji = mode === 'emoji';
  const showMore = mode === 'more';
  const showPanel =
    panelVisible && !isVoice && !keyboardVisible && (showEmoji || showMore);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      onKeyboardOpen?.();
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [onKeyboardOpen]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={styles.wrap}>
        <View style={styles.toolbar}>
          <Pressable onPress={onToggleVoice} style={styles.iconBtn}>
            {isVoice ? <ChatKeyboardIcon /> : <ChatMicIcon />}
          </Pressable>
          {isVoice ? (
            <Pressable
              style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]}
              onLongPress={() => {
                recordingRef.current = true;
                onStartRecord();
              }}
              delayLongPress={120}
              onPressOut={() => {
                if (recordingRef.current) {
                  recordingRef.current = false;
                  onStopRecord(true);
                }
              }}>
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
              placeholder="信息"
              placeholderTextColor={chatTheme.labelTertiary}
              multiline
              onSubmitEditing={onSend}
              onFocus={onKeyboardOpen}
            />
          )}
          {!isVoice && trimmed.length === 0 ? (
            <>
              <Pressable onPress={onToggleEmoji} style={styles.iconBtn}>
                <ChatSmileIcon />
              </Pressable>
              <Pressable onPress={onToggleMore} style={styles.iconBtn}>
                <ChatPlusIcon />
              </Pressable>
            </>
          ) : null}
          {!isVoice && trimmed.length > 0 ? (
            <Pressable style={styles.sendBtn} onPress={onSend}>
              <ChatSendArrowIcon />
            </Pressable>
          ) : null}
        </View>
        {showPanel ? (
          showEmoji ? (
            <EmojiPanel onPick={onAppendEmoji} />
          ) : (
            <MorePanel
              onPickGallery={onPickGallery}
              onPickCamera={onPickCamera}
            />
          )
        ) : null}
        {!keyboardVisible ? <View style={{height: insets.bottom}} /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {backgroundColor: chatTheme.surface},
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: chatTheme.separator,
    borderRadius: chatTheme.inputRadius,
    backgroundColor: chatTheme.fillSecondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...chatTypography.body,
  },
  voiceBtn: {
    flex: 1,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: chatTheme.separator,
    borderRadius: chatTheme.inputRadius,
    backgroundColor: chatTheme.fillSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnActive: {
    backgroundColor: chatTheme.accent,
    borderColor: chatTheme.accent,
  },
  voiceText: {fontSize: 15, color: chatTheme.labelPrimary},
  voiceTextActive: {color: '#FFFFFF'},
  sendBtn: {
    marginLeft: 4,
    marginRight: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: chatTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
