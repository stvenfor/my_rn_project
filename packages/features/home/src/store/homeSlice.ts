import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {User} from '@core/domain';
import type {HomeDashboardData, HomeMetric} from '../models/homeDashboardModel';
import {METRIC_TABS} from '../models/homeDashboardModel';
import {loadDashboard} from '../services/homeRepository';

export function buildGreeting(user: User | null): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
  const name = user?.displayName ?? '访客';
  return `${period}，${name}`;
}

interface HomeState {
  dashboard: HomeDashboardData | null;
  userGreeting: string;
  selectedMetricTab: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: HomeState = {
  dashboard: null,
  userGreeting: buildGreeting(null),
  selectedMetricTab: 0,
  loading: false,
  refreshing: false,
  error: null,
};

export const loadHomeDashboard = createAsyncThunk(
  'home/loadInitial',
  async () => loadDashboard(),
  {
    condition: (_, {getState}) => {
      const {home} = getState() as {home: HomeState};
      return !home.loading;
    },
  },
);

export const refreshHomeDashboard = createAsyncThunk('home/refresh', async () =>
  loadDashboard(),
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setMetricTab(state, action: PayloadAction<number>) {
      state.selectedMetricTab = action.payload;
    },
    updateGreeting(state, action: PayloadAction<User | null>) {
      state.userGreeting = buildGreeting(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadHomeDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHomeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(loadHomeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '加载失败';
      })
      .addCase(refreshHomeDashboard.pending, state => {
        state.refreshing = true;
      })
      .addCase(refreshHomeDashboard.fulfilled, (state, action) => {
        state.refreshing = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(refreshHomeDashboard.rejected, state => {
        state.refreshing = false;
      });
  },
});

export const {setMetricTab, updateGreeting} = homeSlice.actions;
export const homeReducer = homeSlice.reducer;

export const selectHomeDashboard = (state: {home: HomeState}) =>
  state.home.dashboard;
export const selectHomeGreeting = (state: {home: HomeState}) =>
  state.home.userGreeting;
export const selectHomeMetricTab = (state: {home: HomeState}) =>
  state.home.selectedMetricTab;
export const selectHomeLoading = (state: {home: HomeState}) =>
  state.home.loading;
export const selectHomeRefreshing = (state: {home: HomeState}) =>
  state.home.refreshing;
export const selectHomeError = (state: {home: HomeState}) => state.home.error;

export const selectCurrentMetrics = (state: {
  home: HomeState;
}): HomeMetric[] => {
  const data = state.home.dashboard;
  if (!data) {
    return [];
  }
  switch (state.home.selectedMetricTab) {
    case 1:
      return data.metricsYesterday;
    case 2:
      return data.metricsMonth;
    default:
      return data.metricsToday;
  }
};

export {METRIC_TABS};
