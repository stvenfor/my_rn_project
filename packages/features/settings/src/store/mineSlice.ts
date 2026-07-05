import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {User} from '@core/domain';
import type {MineFunctionItem} from '../models/mineFunctionItem';
import {
  demoStats,
  guestStats,
  type MineProfileModel,
} from '../models/mineProfileModel';
import {
  loadMineFunctions,
  saveMineFunctions,
} from '../services/mineFunctionRepository';
import {
  loadSelectedStoreId,
  resolveStoreName,
  saveSelectedStoreId,
} from '../services/mineStoreRepository';

const DEFAULT_AVATAR = 'https://picsum.photos/seed/mine_profile/200/200';

export function maskMinePhone(seed: string): string {
  if (seed.length >= 4) {
    return `138****${seed.substring(seed.length - 4).padStart(4, '0')}`;
  }
  return '138****5678';
}

export function buildMineProfile(
  user: User | null,
  selectedStoreId: string,
): MineProfileModel {
  if (!user) {
    return {
      displayName: '访客',
      avatarUrl: null,
      roleBadge: '未登录',
      storeName: '登录后查看门店信息',
      maskedPhone: '— — —',
      stats: guestStats,
    };
  }

  return {
    displayName: user.displayName?.trim() ? user.displayName : '东东枪',
    avatarUrl: user.avatar?.trim() ? user.avatar : DEFAULT_AVATAR,
    roleBadge: '销售经理',
    storeName: resolveStoreName(selectedStoreId),
    maskedPhone: maskMinePhone(user.id),
    stats: demoStats,
  };
}

interface MineState {
  profile: MineProfileModel | null;
  functions: MineFunctionItem[];
  selectedStoreId: string;
  initialized: boolean;
}

const initialState: MineState = {
  profile: null,
  functions: [],
  selectedStoreId: 'ward_longding',
  initialized: false,
};

export const initializeMine = createAsyncThunk(
  'mine/initialize',
  async (user: User | null) => {
    const [selectedStoreId, functions] = await Promise.all([
      loadSelectedStoreId(),
      loadMineFunctions(),
    ]);
    return {
      selectedStoreId,
      functions,
      profile: buildMineProfile(user, selectedStoreId),
    };
  },
);

export const reorderAndPersistMineFunctions = createAsyncThunk(
  'mine/reorderAndPersist',
  async (
    {fromIndex, toIndex}: {fromIndex: number; toIndex: number},
    {getState},
  ) => {
    const state = getState() as {mine: MineState};
    const current = [...state.mine.functions];
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= current.length ||
      toIndex >= current.length
    ) {
      return current;
    }
    const [item] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, item);
    await saveMineFunctions(current);
    return current;
  },
);

export const persistSelectedStore = createAsyncThunk(
  'mine/persistSelectedStore',
  async (storeId: string) => {
    await saveSelectedStoreId(storeId);
    return storeId;
  },
);

const mineSlice = createSlice({
  name: 'mine',
  initialState,
  reducers: {
    syncMineUser(state, action: PayloadAction<User | null>) {
      state.profile = buildMineProfile(action.payload, state.selectedStoreId);
    },
    applySelectedStore(state, action: PayloadAction<string>) {
      state.selectedStoreId = action.payload;
      if (state.profile) {
        state.profile = {
          ...state.profile,
          storeName: resolveStoreName(action.payload),
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeMine.fulfilled, (state, action) => {
        state.initialized = true;
        state.selectedStoreId = action.payload.selectedStoreId;
        state.functions = action.payload.functions;
        state.profile = action.payload.profile;
      })
      .addCase(reorderAndPersistMineFunctions.pending, (state, action) => {
        const {fromIndex, toIndex} = action.meta.arg;
        const current = [...state.functions];
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= current.length ||
          toIndex >= current.length
        ) {
          return;
        }
        const [item] = current.splice(fromIndex, 1);
        current.splice(toIndex, 0, item);
        state.functions = current;
      })
      .addCase(reorderAndPersistMineFunctions.fulfilled, (state, action) => {
        state.functions = action.payload;
      })
      .addCase(persistSelectedStore.fulfilled, (state, action) => {
        state.selectedStoreId = action.payload;
        if (state.profile) {
          state.profile = {
            ...state.profile,
            storeName: resolveStoreName(action.payload),
          };
        }
      });
  },
});

export const {syncMineUser, applySelectedStore} = mineSlice.actions;

export const mineReducer = mineSlice.reducer;

export const selectMineProfile = (state: {mine: MineState}) =>
  state.mine.profile;
export const selectMineFunctions = (state: {mine: MineState}) =>
  state.mine.functions;
export const selectMineSelectedStoreId = (state: {mine: MineState}) =>
  state.mine.selectedStoreId;
export const selectMineInitialized = (state: {mine: MineState}) =>
  state.mine.initialized;
