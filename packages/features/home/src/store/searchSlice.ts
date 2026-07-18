import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {
  SEARCH_DISCOVERY_SEED,
  SEARCH_FILTER_TAGS,
  SEARCH_HISTORY_SEED,
  SEARCH_RANK_TABS,
  buildSearchRankMock,
  type SearchRankItem,
  type SearchRankTab,
} from '../data/searchMockData';

interface SearchState {
  keyword: string;
  history: string[];
  discovery: string[];
  filterTags: string[];
  selectedRankTab: SearchRankTab;
  rankLists: Record<SearchRankTab, SearchRankItem[]>;
  rotateIndex: number;
  /** Flutter `_isUserEditing` — pause overlay while typing / after clear */
  isUserEditing: boolean;
  isFocused: boolean;
}

const initialRankLists = Object.fromEntries(
  SEARCH_RANK_TABS.map(t => [t.key, buildSearchRankMock(t.key)]),
) as Record<SearchRankTab, SearchRankItem[]>;

const initialState: SearchState = {
  keyword: '',
  history: [...SEARCH_HISTORY_SEED],
  discovery: [...SEARCH_DISCOVERY_SEED],
  filterTags: [...SEARCH_FILTER_TAGS],
  selectedRankTab: 'hotDubbing',
  rankLists: initialRankLists,
  rotateIndex: 0,
  isUserEditing: false,
  isFocused: false,
};

const MAX_HISTORY = 10;

function shouldShowOverlay(state: SearchState): boolean {
  return (
    !state.isUserEditing &&
    !state.isFocused &&
    state.history.length > 0 &&
    state.keyword.trim().length === 0
  );
}

const searchSlice = createSlice({
  name: 'homeSearch',
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
      if (action.payload.trim().length > 0) {
        state.isUserEditing = true;
      }
    },
    clearKeyword(state) {
      state.keyword = '';
      state.isUserEditing = true;
    },
    setSearchFocused(state, action: PayloadAction<boolean>) {
      state.isFocused = action.payload;
      if (action.payload) {
        state.isUserEditing = true;
      } else if (state.keyword.trim().length === 0) {
        state.isUserEditing = false;
      }
    },
    pushHistory(state, action: PayloadAction<string>) {
      const text = action.payload.trim();
      if (!text) {
        return;
      }
      state.history = [
        text,
        ...state.history.filter(item => item !== text),
      ].slice(0, MAX_HISTORY);
      state.rotateIndex = 0;
    },
    /** Flutter onTagTap: fill keyword + history, stay in editing mode */
    applyTagKeyword(state, action: PayloadAction<string>) {
      const text = action.payload.trim();
      if (!text) {
        return;
      }
      state.isUserEditing = true;
      state.keyword = text;
      state.history = [
        text,
        ...state.history.filter(item => item !== text),
      ].slice(0, MAX_HISTORY);
      state.rotateIndex = 0;
    },
    clearHistory(state) {
      state.history = [];
      state.rotateIndex = 0;
      if (!state.isUserEditing && !state.isFocused) {
        state.keyword = '';
      }
    },
    refreshDiscovery(state) {
      const items = [...state.discovery];
      for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
      }
      state.discovery = items;
    },
    setRankTab(state, action: PayloadAction<SearchRankTab>) {
      state.selectedRankTab = action.payload;
    },
    bumpRotateIndex(state) {
      if (!shouldShowOverlay(state) || state.history.length === 0) {
        return;
      }
      state.rotateIndex = (state.rotateIndex + 1) % state.history.length;
    },
  },
});

export const {
  setKeyword,
  clearKeyword,
  setSearchFocused,
  pushHistory,
  applyTagKeyword,
  clearHistory,
  refreshDiscovery,
  setRankTab,
  bumpRotateIndex,
} = searchSlice.actions;

export const homeSearchReducer = searchSlice.reducer;

export const selectSearchKeyword = (s: {homeSearch: SearchState}) =>
  s.homeSearch.keyword;
export const selectSearchHistory = (s: {homeSearch: SearchState}) =>
  s.homeSearch.history;
export const selectSearchDiscovery = (s: {homeSearch: SearchState}) =>
  s.homeSearch.discovery;
export const selectSearchFilterTags = (s: {homeSearch: SearchState}) =>
  s.homeSearch.filterTags;
export const selectSearchRankTab = (s: {homeSearch: SearchState}) =>
  s.homeSearch.selectedRankTab;
export const selectSearchRankList = (s: {homeSearch: SearchState}) =>
  s.homeSearch.rankLists[s.homeSearch.selectedRankTab];
export const selectRotateKeyword = (s: {homeSearch: SearchState}) => {
  const {history, rotateIndex} = s.homeSearch;
  if (history.length === 0) {
    return '';
  }
  return history[rotateIndex % history.length] ?? '';
};
export const selectShowRotatingOverlay = (s: {homeSearch: SearchState}) =>
  shouldShowOverlay(s.homeSearch);
