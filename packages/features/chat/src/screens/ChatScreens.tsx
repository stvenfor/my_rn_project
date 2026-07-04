import React, {useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {
  RoutePath,
  type MainTabScreenProps,
  type RootStackScreenProps,
} from '@core/navigation';
import {
  ListRow,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';
import {
  fetchConversations,
  fetchMessages,
  markConversationRead,
  selectChatError,
  selectChatLoading,
  selectConversations,
  selectMessagesForConversation,
  selectMessagesLoading,
} from '../chatSlice';

type ChatDispatch = ThunkDispatch<
  {
    chat: {
      conversations: unknown[];
      messagesByConversation: Record<string, unknown[]>;
      loading: boolean;
      messagesLoading: boolean;
      error: string | null;
    };
  },
  unknown,
  UnknownAction
>;

export function ChatScreen({navigation}: MainTabScreenProps<'ChatTab'>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<ChatDispatch>();
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('chatTitle')} />
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ListRow
              title={item.title}
              subtitle={item.lastMessage}
              onPress={() =>
                navigation.navigate(RoutePath.chatDetail, {
                  conversationId: item.id,
                  title: item.title,
                })
              }
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

export function ChatDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.chatDetail>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<ChatDispatch>();
  const conversationId = route.params?.conversationId ?? '';
  const title = route.params?.title ?? 'Chat';
  const messages = useSelector(selectMessagesForConversation(conversationId));
  const loading = useSelector(selectMessagesLoading);

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    dispatch(fetchMessages(conversationId));
    dispatch(markConversationRead(conversationId));
  }, [dispatch, conversationId]);

  const imageMessage = messages.find(m => m.type === 'image' && m.remoteUrl);

  return (
    <ScreenContainer>
      <SectionTitle title={title} />
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Text
              style={[
                styles.msg,
                item.isSelf ? styles.msgSelf : styles.msgPeer,
              ]}>
              {item.isSelf ? '' : `${item.senderDisplayName ?? ''}: `}
              {item.content}
            </Text>
          )}
        />
      )}
      {imageMessage?.remoteUrl ? (
        <Pressable
          onPress={() =>
            navigation.navigate(RoutePath.imagePreview, {
              uris: [imageMessage.remoteUrl!],
              initialIndex: 0,
            })
          }>
          <Text style={styles.imageLink}>{t('chatOpenImagePreview')}</Text>
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  msg: {...typography.body, marginTop: 8, padding: 8, borderRadius: 8},
  msgSelf: {alignSelf: 'flex-end', backgroundColor: colors.borderLight},
  msgPeer: {alignSelf: 'flex-start', backgroundColor: colors.divider},
  imageLink: {...typography.body, color: '#4A90E2', marginTop: 16},
  error: {...typography.body, color: colors.error},
});
