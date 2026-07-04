import {
  homeReducer,
  loadHomeDashboard,
  selectHomeBanners,
  selectHomeError,
  selectHomeLoading,
} from '../homeSlice';

jest.mock('@core/api-client', () => ({
  fetchWanAndroidBanner: jest.fn(),
}));

jest.mock('@ui/design-system', () => ({
  AppLoading: {
    run: (fn: () => Promise<unknown>) => fn(),
  },
}));

const {fetchWanAndroidBanner} = jest.requireMock('@core/api-client');

describe('homeSlice', () => {
  const base = {home: homeReducer(undefined, {type: '@@INIT'})};

  it('starts empty', () => {
    expect(selectHomeBanners(base)).toEqual([]);
    expect(selectHomeLoading(base)).toBe(false);
    expect(selectHomeError(base)).toBeNull();
  });

  it('loadHomeDashboard.fulfilled stores banners', async () => {
    fetchWanAndroidBanner.mockResolvedValueOnce([
      {title: 'A', url: 'https://a'},
      {title: 'B', url: 'https://b'},
    ]);
    const action = await loadHomeDashboard()(jest.fn(), jest.fn(), undefined);
    const next = homeReducer(base.home, action);
    expect(selectHomeBanners({home: next})).toHaveLength(2);
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
});
