import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from '@features/auth';
import {envReducer} from './envSlice';
import {appReducer} from './appSlice';
import {homeReducer, allServicesReducer} from '@features/home';
import {mineReducer} from '@features/settings';
import {chatReducer, registerChatDetailReducer} from '@features/chat';
import {communityReducer} from '@features/community';
import {musicReducer} from '@features/music';
import {mainTabReducer} from './mainTabSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    env: envReducer,
    app: appReducer,
    mainTab: mainTabReducer,
    home: homeReducer,
    allServices: allServicesReducer,
    mine: mineReducer,
    chat: chatReducer,
    chatDetail: registerChatDetailReducer().reducer,
    community: communityReducer,
    music: musicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
