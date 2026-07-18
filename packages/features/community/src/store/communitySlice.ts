import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {CommentModel} from '../models/commentModel';
import type {PostModel} from '../models/postModel';
import {
  mockPostRepository,
  resetMockPostRepository,
} from '../services/mockPostRepository';
import {PAGE_SIZE} from '../services/postRepository';

export interface CommunityState {
  posts: PostModel[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  currentPage: number;
  hasMore: boolean;
  error: string | null;
  expandedPostIds: string[];
}

const initialState: CommunityState = {
  posts: [],
  loading: false,
  refreshing: false,
  loadingMore: false,
  currentPage: 0,
  hasMore: true,
  error: null,
  expandedPostIds: [],
};

function replacePost(state: CommunityState, updated: PostModel): void {
  const index = state.posts.findIndex(p => p.id === updated.id);
  if (index >= 0) {
    state.posts[index] = updated;
  }
}

export const loadPosts = createAsyncThunk('community/loadPosts', async () => {
  const list = await mockPostRepository.fetchPosts(0, PAGE_SIZE);
  return list;
});

export const refreshPosts = createAsyncThunk(
  'community/refreshPosts',
  async () => mockPostRepository.fetchPosts(0, PAGE_SIZE),
);

export const loadMorePosts = createAsyncThunk(
  'community/loadMorePosts',
  async (_void, {getState}) => {
    const state = getState() as {community: CommunityState};
    const page = state.community.currentPage;
    return mockPostRepository.fetchPosts(page, PAGE_SIZE);
  },
);

export const toggleLike = createAsyncThunk(
  'community/toggleLike',
  async (postId: string, {getState}) => {
    const state = getState() as {community: CommunityState};
    const post = state.community.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error('post not found');
    }
    return mockPostRepository.toggleLike(postId, !post.isLiked);
  },
);

export const sendComment = createAsyncThunk(
  'community/sendComment',
  async (params: {
    postId: string;
    content: string;
    replyToNickname?: string;
  }) => {
    await mockPostRepository.addComment(params);
    const comments = await mockPostRepository.fetchComments(params.postId);
    return {postId: params.postId, comments};
  },
);

export const deletePost = createAsyncThunk(
  'community/deletePost',
  async (postId: string) => {
    await mockPostRepository.deletePost(postId);
    return postId;
  },
);

export const fetchComments = createAsyncThunk(
  'community/fetchComments',
  async (postId: string) => {
    const comments = await mockPostRepository.fetchComments(postId);
    return {postId, comments};
  },
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    toggleExpanded(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.expandedPostIds.includes(id)) {
        state.expandedPostIds = state.expandedPostIds.filter(x => x !== id);
      } else {
        state.expandedPostIds.push(id);
      }
    },
    resetCommunityState() {
      resetMockPostRepository();
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.hasMore = action.payload.length >= PAGE_SIZE;
        state.currentPage = action.payload.length === 0 ? 0 : 1;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '加载失败';
      })
      .addCase(refreshPosts.pending, state => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshPosts.fulfilled, (state, action) => {
        state.refreshing = false;
        state.posts = action.payload;
        state.hasMore = action.payload.length >= PAGE_SIZE;
        state.currentPage = action.payload.length === 0 ? 0 : 1;
        state.expandedPostIds = [];
      })
      .addCase(refreshPosts.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.error.message ?? '刷新失败';
      })
      .addCase(loadMorePosts.pending, state => {
        state.loadingMore = true;
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        } else {
          state.posts.push(...action.payload);
          state.currentPage += 1;
          state.hasMore = action.payload.length >= PAGE_SIZE;
        }
      })
      .addCase(loadMorePosts.rejected, state => {
        state.loadingMore = false;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        replacePost(state, action.payload);
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        const {postId, comments} = action.payload;
        const index = state.posts.findIndex(p => p.id === postId);
        if (index >= 0) {
          const post = state.posts[index];
          state.posts[index] = {
            ...post,
            commentCount: comments.length,
            previewComments: comments.slice(0, 2),
          };
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
        state.expandedPostIds = state.expandedPostIds.filter(
          id => id !== action.payload,
        );
      });
  },
});

export const {toggleExpanded, resetCommunityState} = communitySlice.actions;
export const communityReducer = communitySlice.reducer;

type RootWithCommunity = {community: CommunityState};

export const selectCommunityPosts = (state: RootWithCommunity) =>
  state.community.posts;
export const selectCommunityLoading = (state: RootWithCommunity) =>
  state.community.loading;
export const selectCommunityRefreshing = (state: RootWithCommunity) =>
  state.community.refreshing;
export const selectCommunityLoadingMore = (state: RootWithCommunity) =>
  state.community.loadingMore;
export const selectCommunityHasMore = (state: RootWithCommunity) =>
  state.community.hasMore;
export const selectCommunityError = (state: RootWithCommunity) =>
  state.community.error;
export const selectExpandedPostIds = (state: RootWithCommunity) =>
  state.community.expandedPostIds;

export function selectPostById(state: RootWithCommunity, id: string) {
  return state.community.posts.find(p => p.id === id);
}

export function selectIsExpanded(
  state: {community: Pick<CommunityState, 'expandedPostIds'>},
  postId: string,
) {
  return state.community.expandedPostIds.includes(postId);
}

export type {CommentModel, PostModel};
