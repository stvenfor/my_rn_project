import {
  homeReducer,
  loadHomeDashboard,
  refreshHomeDashboard,
  selectHomeDashboard,
  selectHomeError,
  selectHomeLoading,
  updateGreeting,
} from '../store/homeSlice';

jest.mock('../services/homeRepository', () => ({
  loadDashboard: jest.fn(),
}));

const {loadDashboard} = jest.requireMock('../services/homeRepository');

const mockDashboard = {
  storeName: '[4S]北京沃德龙鼎吉利',
  features: [],
  quickActions: [],
  metricsToday: [],
  metricsYesterday: [],
  metricsMonth: [],
  metricDetails: [],
  services: [],
  contacts: [],
  news: [],
};

describe('homeSlice', () => {
  const base = {home: homeReducer(undefined, {type: '@@INIT'})};

  it('starts empty', () => {
    expect(selectHomeDashboard(base)).toBeNull();
    expect(selectHomeLoading(base)).toBe(false);
    expect(selectHomeError(base)).toBeNull();
  });

  it('loadHomeDashboard.fulfilled stores dashboard', async () => {
    loadDashboard.mockResolvedValueOnce(mockDashboard);
    const getState = () => ({home: base.home});
    const action = await loadHomeDashboard()(jest.fn(), getState, undefined);
    const next = homeReducer(base.home, action);
    expect(selectHomeDashboard({home: next})?.storeName).toBe(
      '[4S]北京沃德龙鼎吉利',
    );
    expect(selectHomeLoading({home: next})).toBe(false);
  });

  it('loadHomeDashboard.rejected stores error', () => {
    const pending = homeReducer(
      base.home,
      loadHomeDashboard.pending('', undefined),
    );
    const next = homeReducer(
      pending,
      loadHomeDashboard.rejected(new Error('network'), '', undefined),
    );
    expect(selectHomeError({home: next})).toBe('network');
    expect(selectHomeLoading({home: next})).toBe(false);
  });

  it('refreshHomeDashboard.fulfilled updates dashboard', async () => {
    loadDashboard.mockResolvedValueOnce(mockDashboard);
    const action = await refreshHomeDashboard()(
      jest.fn(),
      jest.fn(),
      undefined,
    );
    const next = homeReducer(base.home, action);
    expect(selectHomeDashboard({home: next})).toEqual(mockDashboard);
  });

  it('refreshHomeDashboard.rejected sets error and clears refreshing', () => {
    const refreshing = homeReducer(
      base.home,
      refreshHomeDashboard.pending('', undefined),
    );
    const next = homeReducer(
      refreshing,
      refreshHomeDashboard.rejected(new Error('timeout'), '', undefined),
    );
    expect(next.refreshing).toBe(false);
    expect(selectHomeError({home: next})).toBe('timeout');
  });

  it('updateGreeting sets greeting from user', () => {
    const next = homeReducer(
      base.home,
      updateGreeting({id: '1', displayName: '张三'}),
    );
    expect(next.userGreeting).toMatch(/，张三$/);
  });
});
