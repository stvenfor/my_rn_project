import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchCommunityFeed} from './services/communityService';

export interface FeedItem {
  id: string;
  userId: string;
  author: string;
  avatar: string;
  content: string;
  publishTime: string;
  source: string;
  likes: number;
  commentCount: number;
  images?: string[];
  videoUrl?: string;
  videoCoverUrl?: string;
}

interface CommunityState {
  feed: FeedItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  feed: [],
  loading: false,
  error: null,
};

export const loadCommunityFeed = createAsyncThunk(
  'community/loadFeed',
  async () => fetchCommunityFeed(),
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCommunityFeed.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCommunityFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(loadCommunityFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '加载动态失败';
      });
  },
});

export const communityReducer = communitySlice.reducer;
export const selectCommunityFeed = (state: {community: CommunityState}) =>
  state.community.feed;
export const selectCommunityLoading = (state: {community: CommunityState}) =>
  state.community.loading;
export const selectCommunityError = (state: {community: CommunityState}) =>
  state.community.error;
