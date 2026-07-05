import {
  allServicesReducer,
  loadAllServicesFavorites,
  removeFavorite,
  selectFavoriteItems,
} from '../store/allServicesSlice';

jest.mock('../services/allServicesRepository', () => ({
  loadFavoriteItems: jest.fn(),
  saveFavoriteItems: jest.fn(),
}));

jest.mock('@ui/design-system', () => ({
  AppToast: {show: jest.fn()},
}));

const {loadFavoriteItems, saveFavoriteItems} = jest.requireMock(
  '../services/allServicesRepository',
);

const mockItems = [
  {
    id: 'a',
    label: 'A',
    assetName: 'used_car',
    routePath: 'MusicList',
  },
  {
    id: 'b',
    label: 'B',
    assetName: 'marketing',
    routePath: 'BfuiTemplate',
    templateId: 'x',
  },
  {
    id: 'c',
    label: 'C',
    assetName: 'calculator',
    routePath: 'BfuiTemplate',
    templateId: 'y',
  },
];

describe('allServicesSlice', () => {
  const base = {allServices: allServicesReducer(undefined, {type: '@@INIT'})};

  it('loadAllServicesFavorites.fulfilled stores items', async () => {
    loadFavoriteItems.mockResolvedValueOnce(mockItems);
    const action = await loadAllServicesFavorites()(
      jest.fn(),
      jest.fn(),
      undefined,
    );
    const next = allServicesReducer(base.allServices, action);
    expect(selectFavoriteItems({allServices: next})).toHaveLength(3);
  });

  it('removeFavorite persists when above minimum', async () => {
    saveFavoriteItems.mockResolvedValueOnce(undefined);
    const state = {
      allServices: {
        ...base.allServices,
        favoriteItems: [
          ...mockItems,
          {id: 'd', label: 'D', assetName: 'used_car', routePath: 'x'},
        ],
      },
    };
    const action = await removeFavorite('d')(jest.fn(), () => state, undefined);
    const next = allServicesReducer(state.allServices, action);
    expect(selectFavoriteItems({allServices: next})).toHaveLength(3);
  });
});
