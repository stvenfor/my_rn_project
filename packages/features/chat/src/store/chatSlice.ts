import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {ImConversation} from '@core/im';
import {chatRepository} from '../services/chatRepository';

interface ChatState {
  conversations: ImConversation[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => chatRepository.refreshConversations(),
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    patchConversation(state, action: {payload: ImConversation}) {
      state.conversations = state.conversations.map(c =>
        c.id === action.payload.id ? action.payload : c,
      );
    },
  },
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
      });
  },
});

export const {patchConversation} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
export const selectConversations = (state: {chat: ChatState}) =>
  state.chat.conversations;
export const selectChatLoading = (state: {chat: ChatState}) =>
  state.chat.loading;
export const selectChatError = (state: {chat: ChatState}) => state.chat.error;
