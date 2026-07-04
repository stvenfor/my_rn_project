import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchWanAndroidBanner} from '@core/api-client';
import {AppLoading} from '@ui/design-system';

export interface BannerItem {
  title: string;
  url: string;
}

interface HomeState {
  banners: BannerItem[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {banners: [], loading: false, error: null};

export const loadHomeDashboard = createAsyncThunk('home/load', async () => {
  return AppLoading.run(async () => {
    const banners = await fetchWanAndroidBanner();
    return banners.slice(0, 5);
  }, '加载中');
});

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadHomeDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHomeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(loadHomeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '加载失败';
      });
  },
});

export const homeReducer = homeSlice.reducer;
export const selectHomeBanners = (state: {home: HomeState}) =>
  state.home.banners;
export const selectHomeLoading = (state: {home: HomeState}) =>
  state.home.loading;
export const selectHomeError = (state: {home: HomeState}) => state.home.error;
