import React, {useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {getMediaPickerService} from '@core/media-picker';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {chatRepository} from '../services/chatRepository';
import {ChatDetailAppBar} from '../components/ChatDetailAppBar';
import {InputPanel} from '../components/InputPanel';
import {MessageActionSheet} from '../components/MessageActionSheet';
import {MessageBubble} from '../components/MessageBubble';
import {chatAvatarUrls} from '../models/chatAvatarUrls';
import {
  appendEmoji,
  deleteMessage,
  openChatDetail,
  recallMessage,
  selectActionSheetMessage,
  selectChatDetailLoading,
  selectChatDetailMessages,
  selectInputPanelMode,
  selectInputText,
  selectIsRecordingVoice,
  selectPlayingVoiceId,
  selectRecordDuration,
  sendImageMessage,
  sendTextMessage,
  sendVoiceMessage,
  setInputPanelMode,
  setInputText,
  setMessages,
  setPlayingVoiceId,
  showActionSheet,
  startRecordVoice,
  stopRecordVoice,
  tickRecordVoice,
  toggleEmojiPanel,
  toggleMorePanel,
  toggleVoiceInput,
} from '../store/chatDetailSlice';
import {chatTheme} from '../theme/chatTheme';

type Dispatch = ThunkDispatch<Record<string, unknown>, unknown, UnknownAction>;

const MAX_VOICE_SECONDS = 60;

export function ChatDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.chatDetail>) {
  const dispatch = useDispatch<Dispatch>();
  const {width} = useWindowDimensions();
  const conversationId = route.params?.conversationId ?? '';
  const title = route.params?.title ?? 'Chat';
  const portraitUrl = route.params?.portraitUrl ?? chatAvatarUrls.self;
  const isOnline = route.params?.isOnline ?? false;
  const contentMaxWidth = width >= 840 ? 720 : undefined;

  const messages = useSelector(selectChatDetailMessages);
  const loading = useSelector(selectChatDetailLoading);
  const inputText = useSelector(selectInputText);
  const inputMode = useSelector(selectInputPanelMode);
  const isRecording = useSelector(selectIsRecordingVoice);
  const recordSeconds = useSelector(selectRecordDuration);
  const playingVoiceId = useSelector(selectPlayingVoiceId);
  const actionMessage = useSelector(selectActionSheetMessage);

  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordSecondsRef = useRef(0);

  useEffect(() => {
    recordSecondsRef.current = recordSeconds;
  }, [recordSeconds]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    dispatch(openChatDetail(conversationId));
    const unsubscribe = chatRepository.subscribeMessages(
      conversationId,
      list => {
        dispatch(setMessages(list));
      },
    );
    return unsubscribe;
  }, [dispatch, conversationId]);

  useEffect(() => {
    if (!isRecording) {
      if (recordTimer.current) {
        clearInterval(recordTimer.current);
        recordTimer.current = null;
      }
      return;
    }
    recordTimer.current = setInterval(() => {
      dispatch(tickRecordVoice());
      if (recordSecondsRef.current + 1 >= MAX_VOICE_SECONDS) {
        const duration = MAX_VOICE_SECONDS;
        dispatch(stopRecordVoice());
        dispatch(sendVoiceMessage({conversationId, durationSeconds: duration}));
      }
    }, 1000);
    return () => {
      if (recordTimer.current) {
        clearInterval(recordTimer.current);
      }
    };
  }, [dispatch, isRecording, conversationId]);

  const handleSend = () => {
    dispatch(sendTextMessage({conversationId, text: inputText}));
  };

  const handleStartRecord = () => {
    dispatch(startRecordVoice());
  };

  const handleStopRecord = (send: boolean) => {
    const duration = Math.max(recordSecondsRef.current, 1);
    dispatch(stopRecordVoice());
    if (send && duration >= 1) {
      dispatch(sendVoiceMessage({conversationId, durationSeconds: duration}));
    }
  };

  const pickImage = useCallback(
    async (source: 'gallery' | 'camera') => {
      try {
        const picked = await getMediaPickerService().pickImage({source});
        if (picked?.uri) {
          dispatch(sendImageMessage({conversationId, localUri: picked.uri}));
        }
      } catch {
        AppToast.show(
          source === 'camera' ? '需要相机权限才能拍摄' : '选择图片失败',
        );
      }
    },
    [conversationId, dispatch],
  );

  const handleVoicePress = (messageId: string, duration: number) => {
    if (voiceTimer.current) {
      clearTimeout(voiceTimer.current);
      voiceTimer.current = null;
    }
    if (playingVoiceId === messageId) {
      dispatch(setPlayingVoiceId(null));
      return;
    }
    dispatch(setPlayingVoiceId(messageId));
    voiceTimer.current = setTimeout(() => {
      dispatch(setPlayingVoiceId(null));
    }, duration * 1000);
  };

  const collapsePanelOnKeyboard = useCallback(() => {
    if (inputMode === 'emoji' || inputMode === 'more') {
      dispatch(setInputPanelMode('text'));
    }
  }, [dispatch, inputMode]);

  const panelVisible = inputMode === 'emoji' || inputMode === 'more';

  return (
    <AppPageScaffold layout="edgeToEdge" backgroundColor={chatTheme.background}>
      <View
        style={[
          styles.root,
          contentMaxWidth != null && styles.rootConstrained,
          contentMaxWidth != null && {maxWidth: contentMaxWidth},
        ]}>
        <ChatDetailAppBar
          title={title}
          portraitUrl={portraitUrl}
          isOnline={isOnline}
          onBack={() => navigation.goBack()}
          onMore={() => {}}
        />
        {loading && messages.length === 0 ? (
          <ActivityIndicator style={styles.center} color={chatTheme.accent} />
        ) : (
          <FlatList
            style={styles.list}
            data={messages}
            inverted
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <MessageBubble
                message={item}
                peerAvatar={portraitUrl}
                playingVoiceId={playingVoiceId}
                onLongPress={() => dispatch(showActionSheet(item))}
                onImagePress={uri =>
                  navigation.navigate(RoutePath.imagePreview, {
                    imageUrl: uri,
                    uris: [uri],
                    initialIndex: 0,
                  })
                }
                onVoicePress={() =>
                  handleVoicePress(item.id, item.voiceDurationSeconds ?? 1)
                }
              />
            )}
          />
        )}
        <InputPanel
          mode={inputMode}
          text={inputText}
          isRecording={isRecording}
          recordSeconds={recordSeconds}
          panelVisible={panelVisible}
          onChangeText={value => dispatch(setInputText(value))}
          onToggleVoice={() => dispatch(toggleVoiceInput())}
          onToggleEmoji={() => dispatch(toggleEmojiPanel())}
          onToggleMore={() => dispatch(toggleMorePanel())}
          onSend={handleSend}
          onAppendEmoji={emoji => dispatch(appendEmoji(emoji))}
          onPickGallery={() => pickImage('gallery')}
          onPickCamera={() => pickImage('camera')}
          onStartRecord={handleStartRecord}
          onStopRecord={handleStopRecord}
          onKeyboardOpen={collapsePanelOnKeyboard}
        />
      </View>
      <MessageActionSheet
        message={actionMessage}
        visible={actionMessage != null}
        onClose={() => dispatch(showActionSheet(null))}
        onCopy={() => {
          if (actionMessage?.type === 'text') {
            Clipboard.setString(actionMessage.content);
            AppToast.show('已复制');
          }
          dispatch(showActionSheet(null));
        }}
        onRecall={() => {
          if (actionMessage) {
            dispatch(recallMessage({conversationId, message: actionMessage}));
          }
          dispatch(showActionSheet(null));
        }}
        onDelete={() => {
          if (actionMessage) {
            dispatch(
              deleteMessage({
                conversationId,
                messageId: actionMessage.id,
              }),
            );
          }
          dispatch(showActionSheet(null));
        }}
        onRetry={() => {
          if (actionMessage?.type === 'text') {
            dispatch(setInputText(actionMessage.content));
            dispatch(
              sendTextMessage({conversationId, text: actionMessage.content}),
            );
          }
          dispatch(showActionSheet(null));
        }}
      />
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, width: '100%'},
  rootConstrained: {alignSelf: 'center'},
  list: {flex: 1},
  center: {flex: 1},
});
