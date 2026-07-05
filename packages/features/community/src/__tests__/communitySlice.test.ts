import {configureStore} from '@reduxjs/toolkit';
import {
  communityReducer,
  loadPosts,
  selectCommunityPosts,
  toggleLike,
} from '../store/communitySlice';
import {resetMockPostRepository} from '../services/mockPostRepository';

describe('communitySlice', () => {
  beforeEach(() => {
    resetMockPostRepository();
  });

  it('loads feed aligned with Flutter PostModel fields', async () => {
    const store = configureStore({reducer: {community: communityReducer}});
    await store.dispatch(loadPosts());
    const posts = selectCommunityPosts(store.getState());
    expect(posts.length).toBe(10);
    expect(posts[0]).toMatchObject({
      id: 'post_0',
      userId: expect.any(String),
      nickname: expect.any(String),
      avatar: expect.stringContaining('pravatar.cc'),
      content: expect.any(String),
      publishTime: expect.any(String),
      likeCount: expect.any(Number),
      commentCount: expect.any(Number),
      isLiked: expect.any(Boolean),
      isMine: true,
    });
  });

  it('toggles like count', async () => {
    const store = configureStore({reducer: {community: communityReducer}});
    await store.dispatch(loadPosts());
    const before = selectCommunityPosts(store.getState())[0];
    await store.dispatch(toggleLike(before.id));
    const after = selectCommunityPosts(store.getState())[0];
    expect(after.isLiked).toBe(!before.isLiked);
    expect(after.likeCount).toBe(before.likeCount + (after.isLiked ? 1 : -1));
  });
});
