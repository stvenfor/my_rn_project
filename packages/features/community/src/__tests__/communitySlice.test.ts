import {configureStore} from '@reduxjs/toolkit';
import {
  communityReducer,
  loadCommunityFeed,
  selectCommunityFeed,
} from '../communitySlice';
import {resetCommunityFeedCache} from '../services/communityService';

describe('communitySlice', () => {
  beforeEach(() => {
    resetCommunityFeedCache();
  });

  it('loads feed aligned with Flutter PostModel fields', async () => {
    const store = configureStore({reducer: {community: communityReducer}});
    await store.dispatch(loadCommunityFeed());
    const feed = selectCommunityFeed(store.getState());
    expect(feed.length).toBeGreaterThan(0);
    expect(feed[0]).toMatchObject({
      id: expect.any(String),
      userId: expect.any(String),
      author: expect.any(String),
      content: expect.any(String),
      publishTime: expect.any(String),
      likes: expect.any(Number),
    });
  });
});
