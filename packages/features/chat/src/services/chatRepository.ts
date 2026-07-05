import type {ImMessage} from '@core/im';
import {getImAdapter} from '@core/im';

export const chatRepository = {
  refreshConversations: () => getImAdapter().refreshConversations(),
  getMessages: (conversationId: string) =>
    getImAdapter().getMessages(conversationId),
  subscribeMessages: (
    conversationId: string,
    listener: (messages: ImMessage[]) => void,
  ) => getImAdapter().subscribeMessages(conversationId, listener),
  markConversationRead: (conversationId: string) =>
    getImAdapter().markConversationRead(conversationId),
  sendTextMessage: (conversationId: string, text: string) =>
    getImAdapter().sendTextMessage(conversationId, text),
  sendImageMessage: (conversationId: string, localUri: string) =>
    getImAdapter().sendImageMessage(conversationId, localUri),
  sendVoiceMessage: (
    conversationId: string,
    voicePath: string,
    durationSeconds: number,
  ) =>
    getImAdapter().sendVoiceMessage(conversationId, voicePath, durationSeconds),
  recallMessage: (conversationId: string, messageId: string) =>
    getImAdapter().recallMessage(conversationId, messageId),
  deleteMessage: (conversationId: string, messageId: string) =>
    getImAdapter().deleteMessage(conversationId, messageId),
};
