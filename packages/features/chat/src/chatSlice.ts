import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {ImConversation, ImMessage} from '@core/im';
import {getImAdapter} from '@core/im';

interface ChatState {
  conversations: ImConversation[];
  messagesByConversation: Record<string, ImMessage[]>;
  loading: boolean;
  messagesLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messagesByConversation: {},
  loading: false,
  messagesLoading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => getImAdapter().refreshConversations(),
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string) => {
    const messages = await getImAdapter().getMessages(conversationId);
    return {conversationId, messages};
  },
);

export const markConversationRead = createAsyncThunk(
  'chat/markConversationRead',
  async (conversationId: string) => {
    await getImAdapter().markConversationRead(conversationId);
    return conversationId;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchConversations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '加载会话失败';
      })
      .addCase(fetchMessages.pending, state => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messagesByConversation[action.payload.conversationId] =
          action.payload.messages;
      })
      .addCase(fetchMessages.rejected, state => {
        state.messagesLoading = false;
      })
      .addCase(markConversationRead.fulfilled, (state, action) => {
        state.conversations = state.conversations.map(c =>
          c.id === action.payload ? {...c, unreadCount: 0} : c,
        );
      });
  },
});

export const chatReducer = chatSlice.reducer;
export const selectConversations = (state: {chat: ChatState}) =>
  state.chat.conversations;
export const selectChatLoading = (state: {chat: ChatState}) =>
  state.chat.loading;
export const selectChatError = (state: {chat: ChatState}) => state.chat.error;
export const selectMessagesForConversation =
  (conversationId: string) => (state: {chat: ChatState}) =>
    state.chat.messagesByConversation[conversationId] ?? [];
export const selectMessagesLoading = (state: {chat: ChatState}) =>
  state.chat.messagesLoading;
