import {
  buildMineProfile,
  initializeMine,
  maskMinePhone,
  mineReducer,
  reorderAndPersistMineFunctions,
  selectMineFunctions,
  selectMineProfile,
  syncMineUser,
} from '../store/mineSlice';

jest.mock('../services/mineFunctionRepository', () => ({
  loadMineFunctions: jest.fn(),
  saveMineFunctions: jest.fn(),
}));

jest.mock('../services/mineStoreRepository', () => ({
  loadSelectedStoreId: jest.fn(),
  saveSelectedStoreId: jest.fn(),
  resolveStoreName: jest.fn((id: string) =>
    id === 'tengyuan' ? '[4S]北京腾远吉利北京腾远...' : '[4S]北京沃德龙鼎吉利',
  ),
}));

const {loadMineFunctions, saveMineFunctions} = jest.requireMock(
  '../services/mineFunctionRepository',
);
const {loadSelectedStoreId} = jest.requireMock(
  '../services/mineStoreRepository',
);

const mockFunctions = [
  {
    id: 'sms',
    title: '短信模板',
    subtitle: '一键发送 轻松快捷',
    accentColor: '#E8F8EF',
    iconColor: '#52C41A',
    iconKey: 'sms',
  },
];

describe('mineSlice', () => {
  const base = {mine: mineReducer(undefined, {type: '@@INIT'})};

  it('builds guest profile when user is null', () => {
    const profile = buildMineProfile(null, 'ward_longding');
    expect(profile.displayName).toBe('访客');
    expect(profile.stats[0].value).toBe('0');
  });

  it('masks phone from user id', () => {
    expect(maskMinePhone('user1234')).toBe('138****1234');
  });

  it('initializeMine loads store and functions', async () => {
    loadSelectedStoreId.mockResolvedValueOnce('ward_longding');
    loadMineFunctions.mockResolvedValueOnce(mockFunctions);
    const action = await initializeMine(null)(jest.fn(), jest.fn(), undefined);
    const next = mineReducer(base.mine, action);
    expect(selectMineProfile({mine: next})?.displayName).toBe('访客');
    expect(selectMineFunctions({mine: next})).toHaveLength(1);
  });

  it('syncMineUser updates profile for logged-in user', () => {
    const next = mineReducer(
      base.mine,
      syncMineUser({
        id: 'abc9999',
        displayName: '测试用户',
      }),
    );
    expect(selectMineProfile({mine: next})?.displayName).toBe('测试用户');
    expect(selectMineProfile({mine: next})?.maskedPhone).toBe('138****9999');
  });

  it('reorderAndPersistMineFunctions saves new order', async () => {
    loadMineFunctions.mockResolvedValueOnce(mockFunctions);
    const initialized = await initializeMine(null)(
      jest.fn(),
      jest.fn(),
      undefined,
    );
    const state = mineReducer(base.mine, initialized);
    saveMineFunctions.mockResolvedValueOnce(undefined);

    const second = {...mockFunctions[0], id: 'qa', title: '选买问答'};
    const withTwo = mineReducer(state, {
      type: initializeMine.fulfilled.type,
      payload: {
        selectedStoreId: 'ward_longding',
        functions: [...mockFunctions, second],
        profile: buildMineProfile(null, 'ward_longding'),
      },
    });

    const action = await reorderAndPersistMineFunctions({
      fromIndex: 0,
      toIndex: 1,
    })(jest.fn(), () => ({mine: withTwo}), undefined);
    const next = mineReducer(withTwo, action);
    expect(selectMineFunctions({mine: next})[0].id).toBe('qa');
    expect(saveMineFunctions).toHaveBeenCalled();
  });
});
