import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {AppToast} from '@ui/design-system';
import type {AllServiceItem} from '../data/allServicesData';
import {MAX_FAVORITE_COUNT, MIN_FAVORITE_COUNT} from '../data/allServicesData';
import {
  loadFavoriteItems,
  saveFavoriteItems,
} from '../services/allServicesRepository';

interface AllServicesState {
  favoriteItems: AllServiceItem[];
  isEditing: boolean;
  loading: boolean;
}

const initialState: AllServicesState = {
  favoriteItems: [],
  isEditing: false,
  loading: false,
};

export const loadAllServicesFavorites = createAsyncThunk(
  'allServices/loadFavorites',
  () => loadFavoriteItems(),
);

export const removeFavorite = createAsyncThunk(
  'allServices/removeFavorite',
  async (id: string, {getState}) => {
    const state = getState() as {allServices: AllServicesState};
    if (state.allServices.favoriteItems.length <= MIN_FAVORITE_COUNT) {
      AppToast.show(`常用服务至少保留${MIN_FAVORITE_COUNT}个`);
      return null;
    }
    const next = state.allServices.favoriteItems.filter(item => item.id !== id);
    await saveFavoriteItems(next);
    return next;
  },
);

export const addFavorite = createAsyncThunk(
  'allServices/addFavorite',
  async (item: AllServiceItem, {getState}) => {
    const state = getState() as {allServices: AllServicesState};
    if (state.allServices.favoriteItems.length >= MAX_FAVORITE_COUNT) {
      AppToast.show(`常用服务最多添加${MAX_FAVORITE_COUNT}个`);
      return null;
    }
    if (state.allServices.favoriteItems.some(f => f.id === item.id)) {
      return null;
    }
    const next = [...state.allServices.favoriteItems, item];
    await saveFavoriteItems(next);
    return next;
  },
);

const allServicesSlice = createSlice({
  name: 'allServices',
  initialState,
  reducers: {
    toggleEdit(state) {
      state.isEditing = !state.isEditing;
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAllServicesFavorites.pending, state => {
        state.loading = true;
      })
      .addCase(loadAllServicesFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteItems = action.payload;
      })
      .addCase(loadAllServicesFavorites.rejected, state => {
        state.loading = false;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        if (action.payload) {
          state.favoriteItems = action.payload;
        }
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (action.payload) {
          state.favoriteItems = action.payload;
        }
      });
  },
});

export const {toggleEdit, setEditing} = allServicesSlice.actions;
export const allServicesReducer = allServicesSlice.reducer;

export const selectFavoriteItems = (state: {allServices: AllServicesState}) =>
  state.allServices.favoriteItems;
export const selectAllServicesEditing = (state: {
  allServices: AllServicesState;
}) => state.allServices.isEditing;
export const selectFavoriteIds = (state: {allServices: AllServicesState}) =>
  new Set(state.allServices.favoriteItems.map(item => item.id));
export const selectCanRemoveFavorite = (state: {
  allServices: AllServicesState;
}) => state.allServices.favoriteItems.length > MIN_FAVORITE_COUNT;
export const selectCanAddFavorite = (state: {allServices: AllServicesState}) =>
  state.allServices.favoriteItems.length < MAX_FAVORITE_COUNT;
