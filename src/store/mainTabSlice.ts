import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {collectMainTabs} from '@app/config/moduleManifest';

interface MainTabState {
  selectedIndex: number;
  switchRevision: number;
}

const initialState: MainTabState = {
  selectedIndex: 0,
  switchRevision: 0,
};

export const switchToMainTabModule = createAsyncThunk(
  'mainTab/switchToModule',
  async (moduleId: string) => {
    const index = collectMainTabs().findIndex(tab => tab.moduleId === moduleId);
    if (index < 0) {
      return null;
    }
    return index;
  },
);

const mainTabSlice = createSlice({
  name: 'mainTab',
  initialState,
  reducers: {
    setMainTabIndex(state, action: PayloadAction<number>) {
      if (state.selectedIndex === action.payload) {
        return;
      }
      state.selectedIndex = action.payload;
      state.switchRevision += 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(switchToMainTabModule.fulfilled, (state, action) => {
      if (action.payload == null) {
        return;
      }
      if (state.selectedIndex === action.payload) {
        state.switchRevision += 1;
        return;
      }
      state.selectedIndex = action.payload;
      state.switchRevision += 1;
    });
  },
});

export const {setMainTabIndex} = mainTabSlice.actions;
export const mainTabReducer = mainTabSlice.reducer;

export const selectMainTabSelectedIndex = (state: {mainTab: MainTabState}) =>
  state.mainTab.selectedIndex;
export const selectMainTabSwitchRevision = (state: {mainTab: MainTabState}) =>
  state.mainTab.switchRevision;
