import {configureStore} from '@reduxjs/toolkit';
import {
  chatReducer,
  fetchConversations,
  selectConversations,
} from '../chatSlice';

describe('chatSlice', () => {
  it('loads conversations via IM adapter thunk', async () => {
    const store = configureStore({reducer: {chat: chatReducer}});
    await store.dispatch(fetchConversations());
    const conversations = selectConversations(store.getState());
    expect(conversations.length).toBeGreaterThan(0);
    expect(conversations[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      lastMessage: expect.any(String),
      unreadCount: expect.any(Number),
    });
  });
});
