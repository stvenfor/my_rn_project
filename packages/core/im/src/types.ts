export type ConversationType = 'private' | 'group';

export type MessageType = 'text' | 'image' | 'voice' | 'time' | 'system';
export type MessageSendStatus = 'sending' | 'success' | 'failed';
export type MessageReadStatus = 'unread' | 'read';

export interface ImConversation {
  id: string;
  type: ConversationType;
  targetId: string;
  title: string;
  portraitUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unreadCount: number;
  memberCount: number;
}

export interface ImMessage {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  isSelf: boolean;
  createdAt: string;
  messageUid?: string;
  senderImUserId?: string;
  senderDisplayName?: string;
  sendStatus: MessageSendStatus;
  readStatus: MessageReadStatus;
  isRecalled: boolean;
  voiceDurationSeconds?: number;
  remoteUrl?: string;
}

export interface ImAdapter {
  refreshConversations(): Promise<ImConversation[]>;
  getMessages(conversationId: string): Promise<ImMessage[]>;
  markConversationRead(conversationId: string): Promise<void>;
  sendTextMessage(conversationId: string, text: string): Promise<ImMessage>;
}
