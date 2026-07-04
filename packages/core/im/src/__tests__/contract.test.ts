import {
  MockImAdapter,
  configureImAdapter,
  resetImAdapter,
} from '../mockImAdapter';

describe('@core/im contract', () => {
  beforeEach(() => {
    resetImAdapter();
    configureImAdapter(new MockImAdapter());
  });

  it('returns conversations aligned with Flutter ConversationModel fields', async () => {
    const adapter = new MockImAdapter();
    const list = await adapter.refreshConversations();
    expect(list.length).toBeGreaterThan(0);
    const item = list[0];
    expect(item).toMatchObject({
      id: expect.any(String),
      type: expect.stringMatching(/^(private|group)$/),
      targetId: expect.any(String),
      title: expect.any(String),
      portraitUrl: expect.any(String),
      lastMessage: expect.any(String),
      lastMessageTime: expect.any(String),
      unreadCount: expect.any(Number),
    });
  });

  it('returns messages aligned with Flutter MessageModel fields', async () => {
    const adapter = new MockImAdapter();
    const conversations = await adapter.refreshConversations();
    const messages = await adapter.getMessages(conversations[0].id);
    expect(messages.length).toBeGreaterThan(0);
    const msg = messages[0];
    expect(msg).toMatchObject({
      id: expect.any(String),
      conversationId: expect.any(String),
      type: expect.stringMatching(/^(text|image|voice|time|system)$/),
      content: expect.any(String),
      isSelf: expect.any(Boolean),
      createdAt: expect.any(String),
      sendStatus: expect.stringMatching(/^(sending|success|failed)$/),
      readStatus: expect.stringMatching(/^(unread|read)$/),
      isRecalled: expect.any(Boolean),
    });
  });

  it('marks conversation read and clears unread count', async () => {
    const adapter = new MockImAdapter();
    const before = await adapter.refreshConversations();
    const unread = before.find(c => c.unreadCount > 0);
    expect(unread).toBeDefined();
    await adapter.markConversationRead(unread!.id);
    const after = await adapter.refreshConversations();
    const updated = after.find(c => c.id === unread!.id);
    expect(updated?.unreadCount).toBe(0);
  });
});
