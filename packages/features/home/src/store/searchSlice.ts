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
};

const MAX_HISTORY = 10;

const searchSlice = createSlice({
  name: 'homeSearch',
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    clearKeyword(state) {
      state.keyword = '';
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
    },
    clearHistory(state) {
      state.history = [];
    },
    refreshDiscovery(state) {
      state.discovery = [...state.discovery].sort(() => Math.random() - 0.5);
    },
    setRankTab(state, action: PayloadAction<SearchRankTab>) {
      state.selectedRankTab = action.payload;
    },
    bumpRotateIndex(state) {
      if (state.history.length === 0) {
        return;
      }
      state.rotateIndex = (state.rotateIndex + 1) % state.history.length;
    },
  },
});

export const {
  setKeyword,
  clearKeyword,
  pushHistory,
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
  return history[rotateIndex % history.length];
};
