import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  themeMode: ThemeMode;
  locale: 'zh' | 'en';
}

const initialState: AppState = {themeMode: 'system', locale: 'zh'};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setLocale(state, action: PayloadAction<'zh' | 'en'>) {
      state.locale = action.payload;
    },
  },
});

export const {setThemeMode, setLocale} = appSlice.actions;
export const appReducer = appSlice.reducer;
export const selectThemeMode = (state: {app: AppState}) => state.app.themeMode;
export const selectLocale = (state: {app: AppState}) => state.app.locale;
