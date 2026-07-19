import type {
  ImAdapter,
  ImConversation,
  ImMessage,
  MessageListener,
  Unsubscribe,
} from './types';

const SEND_DELAY_MS = 280;

const SEED_CONVERSATIONS: ImConversation[] = [
  {
    id: 'private_mock_peer_01',
    type: 'private',
    targetId: 'mock_peer_01',
    title: 'Mock好友1',
    portraitUrl: 'https://picsum.photos/seed/chat_mock_peer_01/150/150',
    lastMessage: '晚上一起吃饭吗？',
    lastMessageTime: new Date(Date.now() - 5 * 60_000).toISOString(),
    isOnline: true,
    unreadCount: 2,
    memberCount: 0,
  },
  {
    id: 'private_mock_peer_02',
    type: 'private',
    targetId: 'mock_peer_02',
    title: 'Mock好友2',
    portraitUrl: 'https://picsum.photos/seed/chat_mock_peer_02/150/150',
    lastMessage: '你好',
    lastMessageTime: new Date(Date.now() - 10 * 60_000).toISOString(),
    isOnline: false,
    unreadCount: 0,
    memberCount: 0,
  },
  {
    id: 'private_mock_peer_03',
    type: 'private',
    targetId: 'mock_peer_03',
    title: 'Mock好友3',
    portraitUrl: 'https://picsum.photos/seed/chat_mock_peer_03/150/150',
    lastMessage: '你好',
    lastMessageTime: new Date(Date.now() - 15 * 60_000).toISOString(),
    isOnline: true,
    unreadCount: 0,
    memberCount: 0,
  },
];

function seedMessages(): Record<string, ImMessage[]> {
  const now = Date.now();
  return {
    private_mock_peer_01: [
      {
        id: 'm_2',
        messageUid: 'uid_m_2',
        conversationId: 'private_mock_peer_01',
        type: 'text',
        content: '在的，有什么事？',
        isSelf: true,
        createdAt: new Date(now - 28 * 60_000).toISOString(),
        sendStatus: 'success',
        readStatus: 'read',
        isRecalled: false,
      },
      {
        id: 'm_1',
        messageUid: 'uid_m_1',
        conversationId: 'private_mock_peer_01',
        type: 'text',
        content: '你好，在吗？',
        isSelf: false,
        senderImUserId: 'mock_peer_01',
        senderDisplayName: 'Mock好友1',
        createdAt: new Date(now - 30 * 60_000).toISOString(),
        sendStatus: 'success',
        readStatus: 'read',
        isRecalled: false,
      },
    ],
  };
}

function formatTimeLabel(iso: string): string {
  const time = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const hm = `${String(time.getHours()).padStart(2, '0')}:${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;
  if (msgDay.getTime() === today.getTime()) {
    return hm;
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (msgDay.getTime() === yesterday.getTime()) {
    return `昨天 ${hm}`;
  }
  return `${time.getMonth() + 1}/${time.getDate()} ${hm}`;
}

function shouldInsertTimeDivider(
  messages: ImMessage[],
  createdAt: string,
): boolean {
  if (messages.length === 0) {
    return true;
  }
  const latest = messages[0];
  if (latest.type === 'time') {
    return false;
  }
  const diff = Math.abs(
    new Date(createdAt).getTime() - new Date(latest.createdAt).getTime(),
  );
  return diff >= 5 * 60 * 1000;
}

function previewForMessage(message: ImMessage): string | null {
  switch (message.type) {
    case 'image':
      return '[图片]';
    case 'voice':
      return '[语音]';
    case 'system':
      return message.content;
    case 'time':
      return null;
    default:
      return message.content;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MockImAdapter implements ImAdapter {
  private conversations: ImConversation[] = [];
  private messages: Record<string, ImMessage[]> = {};
  private listeners = new Map<string, Set<MessageListener>>();
  private seeded = false;

  constructor() {
    this.seed();
  }

  private seed(): void {
    if (this.seeded) {
      return;
    }
    this.seeded = true;
    this.conversations = [...SEED_CONVERSATIONS];
    this.messages = seedMessages();
  }

  private emitMessages(conversationId: string): void {
    const list = this.messages[conversationId] ?? [];
    const subs = this.listeners.get(conversationId);
    if (!subs) {
      return;
    }
    subs.forEach(listener => listener([...list]));
  }

  private upsertPreview(conversationId: string, message: ImMessage): void {
    const preview = previewForMessage(message);
    if (!preview) {
      return;
    }
    this.conversations = this.conversations.map(c =>
      c.id === conversationId
        ? {
            ...c,
            lastMessage: preview,
            lastMessageTime: message.createdAt,
            unreadCount: message.isSelf ? c.unreadCount : c.unreadCount + 1,
          }
        : c,
    );
  }

  private insertMessage(message: ImMessage): void {
    const list = this.messages[message.conversationId] ?? [];
    this.messages[message.conversationId] = [message, ...list];
    this.upsertPreview(message.conversationId, message);
    this.emitMessages(message.conversationId);
  }

  private replaceMessage(message: ImMessage): void {
    const list = this.messages[message.conversationId];
    if (!list) {
      return;
    }
    this.messages[message.conversationId] = list.map(m =>
      m.id === message.id ? message : m,
    );
    this.emitMessages(message.conversationId);
  }

  async refreshConversations(): Promise<ImConversation[]> {
    return [...this.conversations].sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime(),
    );
  }

  async getMessages(conversationId: string): Promise<ImMessage[]> {
    return [...(this.messages[conversationId] ?? [])];
  }

  subscribeMessages(
    conversationId: string,
    listener: MessageListener,
  ): Unsubscribe {
    if (!this.listeners.has(conversationId)) {
      this.listeners.set(conversationId, new Set());
    }
    this.listeners.get(conversationId)!.add(listener);
    listener([...(this.messages[conversationId] ?? [])]);
    return () => {
      this.listeners.get(conversationId)?.delete(listener);
    };
  }

  async markConversationRead(conversationId: string): Promise<void> {
    this.conversations = this.conversations.map(c =>
      c.id === conversationId ? {...c, unreadCount: 0} : c,
    );
    const list = this.messages[conversationId];
    if (list) {
      this.messages[conversationId] = list.map(m =>
        !m.isSelf && m.readStatus === 'unread'
          ? {...m, readStatus: 'read' as const}
          : m,
      );
      this.emitMessages(conversationId);
    }
  }

  async sendTextMessage(
    conversationId: string,
    text: string,
  ): Promise<ImMessage> {
    const now = new Date().toISOString();
    const existing = this.messages[conversationId] ?? [];
    if (shouldInsertTimeDivider(existing, now)) {
      this.insertMessage({
        id: `time_${Date.now()}`,
        conversationId,
        type: 'time',
        content: formatTimeLabel(now),
        isSelf: false,
        createdAt: now,
        sendStatus: 'success',
        readStatus: 'read',
        isRecalled: false,
      });
    }
    const pending: ImMessage = {
      id: `local_${Date.now()}`,
      messageUid: `uid_${Date.now()}`,
      conversationId,
      type: 'text',
      content: text,
      isSelf: true,
      createdAt: now,
      sendStatus: 'sending',
      readStatus: 'read',
      isRecalled: false,
    };
    this.insertMessage(pending);
    await delay(SEND_DELAY_MS);
    const success = {...pending, sendStatus: 'success' as const};
    this.replaceMessage(success);
    setTimeout(() => {
      this.replaceMessage({...success, readStatus: 'read'});
    }, 2000);
    return success;
  }

  async sendImageMessage(
    conversationId: string,
    localUri: string,
  ): Promise<ImMessage> {
    const now = new Date().toISOString();
    const message: ImMessage = {
      id: `local_${Date.now()}`,
      conversationId,
      type: 'image',
      content: '[图片]',
      isSelf: true,
      createdAt: now,
      localUri,
      remoteUrl: localUri.startsWith('http') ? localUri : undefined,
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    };
    this.insertMessage(message);
    return message;
  }

  async sendVoiceMessage(
    conversationId: string,
    voicePath: string,
    durationSeconds: number,
  ): Promise<ImMessage> {
    const message: ImMessage = {
      id: `local_${Date.now()}`,
      conversationId,
      type: 'voice',
      content: '[语音]',
      isSelf: true,
      createdAt: new Date().toISOString(),
      voiceDurationSeconds: durationSeconds,
      localUri: voicePath,
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    };
    this.insertMessage(message);
    return message;
  }

  async recallMessage(
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    const list = this.messages[conversationId];
    const target = list?.find(m => m.id === messageId);
    if (!target) {
      return;
    }
    const system: ImMessage = {
      id: `sys_${Date.now()}`,
      conversationId,
      type: 'system',
      content: '你撤回了一条消息',
      isSelf: true,
      createdAt: new Date().toISOString(),
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    };
    this.messages[conversationId] = list!.filter(m => m.id !== messageId);
    this.messages[conversationId] = [system, ...this.messages[conversationId]];
    this.emitMessages(conversationId);
  }

  async deleteMessage(
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    const list = this.messages[conversationId];
    if (!list) {
      return;
    }
    this.messages[conversationId] = list.filter(m => m.id !== messageId);
    this.emitMessages(conversationId);
  }

  async loadHistory(
    conversationId: string,
    _beforeMessageId?: string,
    _limit?: number,
  ): Promise<ImMessage[]> {
    return this.getMessages(conversationId);
  }
}

let adapter: ImAdapter = new MockImAdapter();

export function getImAdapter(): ImAdapter {
  return adapter;
}

export function configureImAdapter(next?: ImAdapter): void {
  adapter = next ?? new MockImAdapter();
}

export function resetImAdapter(): void {
  adapter = new MockImAdapter();
}
