import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {AppEnv} from '@core/domain';
import {ENV_CONFIGS, ENV_STORAGE_KEY} from '@core/config';
import {storage} from '@core/storage';
import {reinitializeApiClient} from '@core/api-client';

interface EnvState {
  currentEnv: AppEnv;
}

const initialState: EnvState = {currentEnv: 'test'};

export const loadEnv = createAsyncThunk('env/load', async () => {
  const saved = await storage.getItem(ENV_STORAGE_KEY);
  if (saved === 'staging' || saved === 'production' || saved === 'test') {
    return saved as AppEnv;
  }
  return 'test' as AppEnv;
});

export const setEnv = createAsyncThunk('env/set', async (env: AppEnv) => {
  await storage.setItem(ENV_STORAGE_KEY, env);
  const cfg = ENV_CONFIGS[env];
  reinitializeApiClient(cfg.baseUrl, cfg.label);
  return env;
});

const envSlice = createSlice({
  name: 'env',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadEnv.fulfilled, (state, action) => {
        state.currentEnv = action.payload;
        const cfg = ENV_CONFIGS[action.payload];
        reinitializeApiClient(cfg.baseUrl, cfg.label);
      })
      .addCase(setEnv.fulfilled, (state, action) => {
        state.currentEnv = action.payload;
      });
  },
});

export const envReducer = envSlice.reducer;
export const selectCurrentEnv = (state: {env: EnvState}) =>
  state.env.currentEnv;
export const selectEnvLabel = (state: {env: EnvState}) =>
  ENV_CONFIGS[state.env.currentEnv].label;
