import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from '@features/auth';
import {envReducer} from './envSlice';
import {appReducer} from './appSlice';
import {homeReducer} from '@features/home';
import {chatReducer} from '@features/chat';
import {communityReducer} from '@features/community';
import {musicReducer} from '@features/music';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    env: envReducer,
    app: appReducer,
    home: homeReducer,
    chat: chatReducer,
    community: communityReducer,
    music: musicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
