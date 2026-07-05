import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type MainTabScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, PrimaryButton} from '@ui/design-system';
import {ConversationListItem} from '../components/ConversationListItem';
import {
  fetchConversations,
  selectChatError,
  selectChatLoading,
  selectConversations,
} from '../store/chatSlice';
import {chatTheme} from '../theme/chatTheme';

type Dispatch = ThunkDispatch<Record<string, unknown>, unknown, UnknownAction>;

function ConversationSeparator() {
  return <View style={styles.divider} />;
}

function ChatNavActions() {
  return (
    <View style={styles.navActions}>
      <Pressable style={styles.navBtn} onPress={() => {}}>
        <Text style={styles.navIcon}>🔍</Text>
      </Pressable>
      <Pressable style={styles.navBtn} onPress={() => {}}>
        <Text style={styles.navIcon}>＋</Text>
      </Pressable>
    </View>
  );
}

export function ChatScreen({navigation}: MainTabScreenProps<'ChatTab'>) {
  const dispatch = useDispatch<Dispatch>();
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const openConversation = useCallback(
    (item: (typeof conversations)[number]) => {
      navigation.navigate(RoutePath.chatDetail, {
        conversationId: item.id,
        title: item.title,
        portraitUrl: item.portraitUrl,
        type: item.type,
        isOnline: item.isOnline,
      });
    },
    [navigation],
  );

  return (
    <AppPageScaffold
      backgroundColor={chatTheme.pageBackground}
      navBar={<AppNavBar title="微信" right={<ChatNavActions />} />}>
      {loading && conversations.length === 0 ? (
        <ActivityIndicator
          style={styles.center}
          color={chatTheme.wechatGreen}
        />
      ) : error && conversations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <PrimaryButton
            title="重试"
            onPress={() => dispatch(fetchConversations())}
          />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => dispatch(fetchConversations())}
            />
          }
          ItemSeparatorComponent={ConversationSeparator}
          renderItem={({item}) => (
            <ConversationListItem
              conversation={item}
              onPress={() => openConversation(item)}
            />
          )}
        />
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  navActions: {flexDirection: 'row'},
  navBtn: {width: 36, alignItems: 'center'},
  navIcon: {fontSize: 20, color: chatTheme.iconMuted},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: chatTheme.divider,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {color: '#E53935', marginBottom: 12},
});
