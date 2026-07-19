import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type MainTabScreenProps} from '@core/navigation';
import {AppPageScaffold, PrimaryButton} from '@ui/design-system';
import {ChatComposeIcon, ChatSearchIcon} from '../components/ChatIcons';
import {ConversationListItem} from '../components/ConversationListItem';
import {
  fetchConversations,
  selectChatError,
  selectChatLoading,
  selectConversations,
} from '../store/chatSlice';
import {chatTheme, chatTypography} from '../theme/chatTheme';

type Dispatch = ThunkDispatch<Record<string, unknown>, unknown, UnknownAction>;

function ChatNavActions() {
  return (
    <View style={styles.navActions}>
      <Pressable style={styles.navBtn} onPress={() => {}} hitSlop={8}>
        <ChatSearchIcon />
      </Pressable>
      <Pressable style={styles.navBtn} onPress={() => {}} hitSlop={8}>
        <ChatComposeIcon />
      </Pressable>
    </View>
  );
}

export function ChatScreen({navigation}: MainTabScreenProps<'ChatTab'>) {
  const dispatch = useDispatch<Dispatch>();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);
  const contentMaxWidth = width >= 840 ? 720 : undefined;

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchConversations());
    }, [dispatch]),
  );

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
      layout="mainTabRoot"
      backgroundColor={chatTheme.background}>
      <View
        style={[
          styles.root,
          contentMaxWidth != null && styles.rootConstrained,
          contentMaxWidth != null && {maxWidth: contentMaxWidth},
        ]}>
        <View style={[styles.header, {paddingTop: insets.top + 8}]}>
          <Text style={styles.largeTitle}>消息</Text>
          <ChatNavActions />
        </View>
        {loading && conversations.length === 0 ? (
          <ActivityIndicator style={styles.center} color={chatTheme.accent} />
        ) : error && conversations.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
            <PrimaryButton
              title="重试"
              onPress={() => dispatch(fetchConversations())}
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listPad}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                tintColor={chatTheme.accent}
                colors={[chatTheme.accent]}
                onRefresh={() => dispatch(fetchConversations())}
              />
            }>
            <View style={styles.card}>
              {conversations.map((item, index) => (
                <View key={item.id}>
                  <ConversationListItem
                    conversation={item}
                    onPress={() => openConversation(item)}
                  />
                  {index < conversations.length - 1 ? (
                    <View style={styles.groupedDivider} />
                  ) : null}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  rootConstrained: {
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
  largeTitle: {
    flex: 1,
    ...chatTypography.largeTitle,
  },
  navActions: {flexDirection: 'row', alignItems: 'center'},
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPad: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: chatTheme.surface,
    borderRadius: chatTheme.radiusMd,
    overflow: 'hidden',
  },
  groupedDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: chatTheme.separator,
    marginLeft: 72,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {...chatTypography.caption, marginBottom: 12},
});
