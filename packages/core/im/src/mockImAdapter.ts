import type {ImAdapter, ImConversation, ImMessage} from './types';

const MOCK_CONVERSATIONS: ImConversation[] = [
  {
    id: 'private_mock_peer_01',
    type: 'private',
    targetId: 'mock_peer_01',
    title: 'Mock好友01',
    portraitUrl: 'https://picsum.photos/seed/im1/80/80',
    lastMessage: '好的，收到',
    lastMessageTime: new Date(Date.now() - 3600_000).toISOString(),
    isOnline: true,
    unreadCount: 0,
    memberCount: 0,
  },
  {
    id: 'private_mock_peer_02',
    type: 'private',
    targetId: 'mock_peer_02',
    title: 'Mock好友02',
    portraitUrl: 'https://picsum.photos/seed/im2/80/80',
    lastMessage: '明天下午开会',
    lastMessageTime: new Date(Date.now() - 7200_000).toISOString(),
    isOnline: false,
    unreadCount: 2,
    memberCount: 0,
  },
  {
    id: 'group_product_discuss',
    type: 'group',
    targetId: 'group_product_discuss',
    title: '产品讨论群',
    portraitUrl: 'https://picsum.photos/seed/im3/80/80',
    lastMessage: '问题已解决',
    lastMessageTime: new Date(Date.now() - 1800_000).toISOString(),
    isOnline: false,
    unreadCount: 1,
    memberCount: 12,
  },
];

const MOCK_MESSAGES: Record<string, ImMessage[]> = {
  private_mock_peer_01: [
    {
      id: 'msg_1',
      conversationId: 'private_mock_peer_01',
      type: 'text',
      content: '你好，在吗？',
      isSelf: false,
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
      senderImUserId: 'mock_peer_01',
      senderDisplayName: 'Mock好友01',
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    },
    {
      id: 'msg_2',
      conversationId: 'private_mock_peer_01',
      type: 'text',
      content: '好的，收到',
      isSelf: true,
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    },
  ],
  private_mock_peer_02: [
    {
      id: 'msg_3',
      conversationId: 'private_mock_peer_02',
      type: 'text',
      content: '明天下午开会',
      isSelf: false,
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
      senderImUserId: 'mock_peer_02',
      senderDisplayName: 'Mock好友02',
      sendStatus: 'success',
      readStatus: 'unread',
      isRecalled: false,
    },
  ],
  group_product_discuss: [
    {
      id: 'msg_4',
      conversationId: 'group_product_discuss',
      type: 'text',
      content: '新版本什么时候发布？',
      isSelf: false,
      createdAt: new Date(Date.now() - 5400_000).toISOString(),
      senderDisplayName: '技术支持',
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    },
    {
      id: 'msg_5',
      conversationId: 'group_product_discuss',
      type: 'image',
      content: '[图片]',
      isSelf: false,
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      remoteUrl: 'https://picsum.photos/400/300?random=99',
      sendStatus: 'success',
      readStatus: 'unread',
      isRecalled: false,
    },
    {
      id: 'msg_6',
      conversationId: 'group_product_discuss',
      type: 'text',
      content: '问题已解决',
      isSelf: true,
      createdAt: new Date(Date.now() - 1800_000).toISOString(),
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    },
  ],
};

export class MockImAdapter implements ImAdapter {
  private conversations = [...MOCK_CONVERSATIONS];
  private messages = {...MOCK_MESSAGES};

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

  async markConversationRead(conversationId: string): Promise<void> {
    this.conversations = this.conversations.map(c =>
      c.id === conversationId ? {...c, unreadCount: 0} : c,
    );
    const list = this.messages[conversationId];
    if (list) {
      this.messages[conversationId] = list.map(m => ({
        ...m,
        readStatus: 'read' as const,
      }));
    }
  }

  async sendTextMessage(
    conversationId: string,
    text: string,
  ): Promise<ImMessage> {
    const message: ImMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      type: 'text',
      content: text,
      isSelf: true,
      createdAt: new Date().toISOString(),
      sendStatus: 'success',
      readStatus: 'read',
      isRecalled: false,
    };
    this.messages[conversationId] = [
      ...(this.messages[conversationId] ?? []),
      message,
    ];
    this.conversations = this.conversations.map(c =>
      c.id === conversationId
        ? {...c, lastMessage: text, lastMessageTime: message.createdAt}
        : c,
    );
    return message;
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
