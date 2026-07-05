import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {ImMessage} from '@core/im';
import {AppToast} from '@ui/design-system';
import {chatRepository} from '../services/chatRepository';
import {canRecallMessage} from '../utils/timeDivider';

export type InputPanelMode = 'text' | 'voice' | 'emoji' | 'more';

interface ChatDetailState {
  conversationId: string | null;
  messages: ImMessage[];
  loading: boolean;
  inputText: string;
  inputPanelMode: InputPanelMode;
  isRecordingVoice: boolean;
  recordDurationSeconds: number;
  playingVoiceId: string | null;
  actionSheetMessage: ImMessage | null;
}

const initialState: ChatDetailState = {
  conversationId: null,
  messages: [],
  loading: false,
  inputText: '',
  inputPanelMode: 'text',
  isRecordingVoice: false,
  recordDurationSeconds: 0,
  playingVoiceId: null,
  actionSheetMessage: null,
};

export const openChatDetail = createAsyncThunk(
  'chatDetail/open',
  async (conversationId: string) => {
    await chatRepository.markConversationRead(conversationId);
    const messages = await chatRepository.getMessages(conversationId);
    return {conversationId, messages};
  },
);

export const sendTextMessage = createAsyncThunk(
  'chatDetail/sendText',
  async ({conversationId, text}: {conversationId: string; text: string}) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }
    return chatRepository.sendTextMessage(conversationId, trimmed);
  },
);

export const sendImageMessage = createAsyncThunk(
  'chatDetail/sendImage',
  async ({
    conversationId,
    localUri,
  }: {
    conversationId: string;
    localUri: string;
  }) => chatRepository.sendImageMessage(conversationId, localUri),
);

export const sendVoiceMessage = createAsyncThunk(
  'chatDetail/sendVoice',
  async ({
    conversationId,
    durationSeconds,
  }: {
    conversationId: string;
    durationSeconds: number;
  }) =>
    chatRepository.sendVoiceMessage(
      conversationId,
      `voice_mock_${durationSeconds}`,
      durationSeconds,
    ),
);

export const recallMessage = createAsyncThunk(
  'chatDetail/recall',
  async (
    {conversationId, message}: {conversationId: string; message: ImMessage},
    {rejectWithValue},
  ) => {
    if (!canRecallMessage(message)) {
      AppToast.show('超过 3 分钟，无法撤回');
      return rejectWithValue('recall_expired');
    }
    await chatRepository.recallMessage(conversationId, message.id);
    AppToast.show('已撤回');
    const messages = await chatRepository.getMessages(conversationId);
    return messages;
  },
);

export const deleteMessage = createAsyncThunk(
  'chatDetail/delete',
  async ({
    conversationId,
    messageId,
  }: {
    conversationId: string;
    messageId: string;
  }) => {
    await chatRepository.deleteMessage(conversationId, messageId);
    AppToast.show('已删除');
    const messages = await chatRepository.getMessages(conversationId);
    return messages;
  },
);

const chatDetailSlice = createSlice({
  name: 'chatDetail',
  initialState,
  reducers: {
    setConversationId(state, action: PayloadAction<string | null>) {
      state.conversationId = action.payload;
    },
    setMessages(state, action: PayloadAction<ImMessage[]>) {
      state.messages = action.payload;
    },
    setInputText(state, action: PayloadAction<string>) {
      state.inputText = action.payload;
    },
    setInputPanelMode(state, action: PayloadAction<InputPanelMode>) {
      state.inputPanelMode = action.payload;
    },
    toggleVoiceInput(state) {
      state.inputPanelMode =
        state.inputPanelMode === 'voice' ? 'text' : 'voice';
    },
    toggleEmojiPanel(state) {
      state.inputPanelMode =
        state.inputPanelMode === 'emoji' ? 'text' : 'emoji';
    },
    toggleMorePanel(state) {
      state.inputPanelMode = state.inputPanelMode === 'more' ? 'text' : 'more';
    },
    appendEmoji(state, action: PayloadAction<string>) {
      state.inputText = `${state.inputText}${action.payload}`;
    },
    startRecordVoice(state) {
      state.isRecordingVoice = true;
      state.recordDurationSeconds = 0;
    },
    tickRecordVoice(state) {
      state.recordDurationSeconds += 1;
    },
    stopRecordVoice(state) {
      state.isRecordingVoice = false;
      state.recordDurationSeconds = 0;
    },
    setPlayingVoiceId(state, action: PayloadAction<string | null>) {
      state.playingVoiceId = action.payload;
    },
    showActionSheet(state, action: PayloadAction<ImMessage | null>) {
      state.actionSheetMessage = action.payload;
    },
    clearDetail(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(openChatDetail.pending, state => {
        state.loading = true;
      })
      .addCase(openChatDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.conversationId;
        state.messages = action.payload.messages;
      })
      .addCase(openChatDetail.rejected, state => {
        state.loading = false;
      })
      .addCase(sendTextMessage.fulfilled, (state, action) => {
        if (action.payload) {
          state.inputText = '';
          state.inputPanelMode = 'text';
        }
      })
      .addCase(sendImageMessage.fulfilled, state => {
        state.inputPanelMode = 'text';
      })
      .addCase(sendVoiceMessage.fulfilled, state => {
        state.inputPanelMode = 'text';
      })
      .addCase(recallMessage.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const {
  setConversationId,
  setMessages,
  setInputText,
  setInputPanelMode,
  toggleVoiceInput,
  toggleEmojiPanel,
  toggleMorePanel,
  appendEmoji,
  startRecordVoice,
  tickRecordVoice,
  stopRecordVoice,
  setPlayingVoiceId,
  showActionSheet,
  clearDetail,
} = chatDetailSlice.actions;

export const chatDetailReducer = chatDetailSlice.reducer;
export const selectChatDetailMessages = (state: {
  chatDetail: ChatDetailState;
}) => state.chatDetail.messages;
export const selectChatDetailLoading = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.loading;
export const selectInputText = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.inputText;
export const selectInputPanelMode = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.inputPanelMode;
export const selectIsRecordingVoice = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.isRecordingVoice;
export const selectRecordDuration = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.recordDurationSeconds;
export const selectPlayingVoiceId = (state: {chatDetail: ChatDetailState}) =>
  state.chatDetail.playingVoiceId;
export const selectActionSheetMessage = (state: {
  chatDetail: ChatDetailState;
}) => state.chatDetail.actionSheetMessage;
