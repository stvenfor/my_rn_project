import {useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import type {
  RnLabTicket,
  RnLabTicketCategory,
  RnLabTicketPriority,
  RnLabTicketStatus,
} from '../data/rnLabLayoutMockData';
import {
  batchAdvanceRnLabTickets,
  fetchRnLabTicketPage,
  updateRnLabTicket,
  type RnLabSortKey,
} from '../services/rnLabLayoutRepository';

const PAGE_SIZE = 12;

export type RnLabLoadMode = 'init' | 'refresh' | 'more' | 'filter';

interface BoardState {
  list: RnLabTicket[];
  total: number;
  page: number;
  hasMore: boolean;
  statusCounts: Record<RnLabTicketStatus | 'all', number>;
  status: RnLabTicketStatus | 'all';
  priority: RnLabTicketPriority | 'all';
  category: RnLabTicketCategory | 'all';
  sort: RnLabSortKey;
  keyword: string;
  keywordInput: string;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  selecting: boolean;
  selectedIds: string[];
  detailId: string | null;
  mutating: boolean;
}

type BoardAction =
  | {type: 'setKeywordInput'; value: string}
  | {type: 'applyKeyword'; value: string}
  | {type: 'setStatus'; value: RnLabTicketStatus | 'all'}
  | {type: 'setPriority'; value: RnLabTicketPriority | 'all'}
  | {type: 'setCategory'; value: RnLabTicketCategory | 'all'}
  | {type: 'setSort'; value: RnLabSortKey}
  | {type: 'loadStart'; mode: RnLabLoadMode}
  | {
      type: 'loadSuccess';
      mode: RnLabLoadMode;
      list: RnLabTicket[];
      total: number;
      page: number;
      hasMore: boolean;
      statusCounts: Record<RnLabTicketStatus | 'all', number>;
    }
  | {type: 'loadFailure'; mode: RnLabLoadMode; error: string}
  | {type: 'toggleSelecting'}
  | {type: 'clearSelection'}
  | {type: 'toggleSelect'; id: string}
  | {type: 'selectAllVisible'}
  | {type: 'openDetail'; id: string}
  | {type: 'closeDetail'}
  | {type: 'mutateStart'}
  | {type: 'mutateEnd'}
  | {type: 'replaceTicket'; ticket: RnLabTicket}
  | {type: 'replaceMany'; tickets: RnLabTicket[]};

const initialCounts: Record<RnLabTicketStatus | 'all', number> = {
  all: 0,
  pending: 0,
  processing: 0,
  blocked: 0,
  done: 0,
};

const initialState: BoardState = {
  list: [],
  total: 0,
  page: 0,
  hasMore: true,
  statusCounts: initialCounts,
  status: 'all',
  priority: 'all',
  category: 'all',
  sort: 'slaAsc',
  keyword: '',
  keywordInput: '',
  loading: true,
  refreshing: false,
  loadingMore: false,
  error: null,
  selecting: false,
  selectedIds: [],
  detailId: null,
  mutating: false,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'setKeywordInput':
      return {...state, keywordInput: action.value};
    case 'applyKeyword':
      return {
        ...state,
        keyword: action.value.trim(),
        keywordInput: action.value,
        selectedIds: [],
      };
    case 'setStatus':
      return {...state, status: action.value, selectedIds: []};
    case 'setPriority':
      return {...state, priority: action.value, selectedIds: []};
    case 'setCategory':
      return {...state, category: action.value, selectedIds: []};
    case 'setSort':
      return {...state, sort: action.value, selectedIds: []};
    case 'loadStart':
      return {
        ...state,
        loading: action.mode === 'init' || action.mode === 'filter',
        refreshing: action.mode === 'refresh',
        loadingMore: action.mode === 'more',
        error: action.mode === 'more' ? state.error : null,
      };
    case 'loadSuccess':
      return {
        ...state,
        loading: false,
        refreshing: false,
        loadingMore: false,
        error: null,
        list:
          action.mode === 'more'
            ? [...state.list, ...action.list]
            : action.list,
        total: action.total,
        page: action.page,
        hasMore: action.hasMore,
        statusCounts: action.statusCounts,
      };
    case 'loadFailure':
      return {
        ...state,
        loading: false,
        refreshing: false,
        loadingMore: false,
        error:
          action.mode === 'more'
            ? state.error
            : action.error,
      };
    case 'toggleSelecting':
      return {
        ...state,
        selecting: !state.selecting,
        selectedIds: state.selecting ? [] : state.selectedIds,
      };
    case 'clearSelection':
      return {...state, selectedIds: [], selecting: false};
    case 'toggleSelect': {
      const exists = state.selectedIds.includes(action.id);
      return {
        ...state,
        selectedIds: exists
          ? state.selectedIds.filter(id => id !== action.id)
          : [...state.selectedIds, action.id],
      };
    }
    case 'selectAllVisible':
      return {
        ...state,
        selecting: true,
        selectedIds: state.list.map(item => item.id),
      };
    case 'openDetail':
      return {...state, detailId: action.id};
    case 'closeDetail':
      return {...state, detailId: null};
    case 'mutateStart':
      return {...state, mutating: true};
    case 'mutateEnd':
      return {...state, mutating: false};
    case 'replaceTicket':
      return {
        ...state,
        list: state.list.map(item =>
          item.id === action.ticket.id ? action.ticket : item,
        ),
      };
    case 'replaceMany': {
      const map = new Map(action.tickets.map(item => [item.id, item]));
      return {
        ...state,
        list: state.list.map(item => map.get(item.id) ?? item),
      };
    }
    default:
      return state;
  }
}

export function useRnLabLayoutBoard() {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const requestSeq = useRef(0);
  const pageRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryRef = useRef({
    status: state.status,
    priority: state.priority,
    category: state.category,
    keyword: state.keyword,
    sort: state.sort,
  });
  queryRef.current = {
    status: state.status,
    priority: state.priority,
    category: state.category,
    keyword: state.keyword,
    sort: state.sort,
  };

  const load = useCallback(async (mode: RnLabLoadMode, forceError = false) => {
    const seq = ++requestSeq.current;
    const page = mode === 'more' ? pageRef.current + 1 : 0;
    dispatch({type: 'loadStart', mode});
    try {
      const result = await fetchRnLabTicketPage({
        ...queryRef.current,
        page,
        pageSize: PAGE_SIZE,
        forceError,
      });
      if (seq !== requestSeq.current) {
        return;
      }
      pageRef.current = result.page;
      dispatch({
        type: 'loadSuccess',
        mode,
        list: result.list,
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
        statusCounts: result.statusCounts,
      });
    } catch (e) {
      if (seq !== requestSeq.current) {
        return;
      }
      dispatch({
        type: 'loadFailure',
        mode,
        error: e instanceof Error ? e.message : '加载失败',
      });
    }
  }, []);

  useEffect(() => {
    pageRef.current = 0;
    load('filter');
  }, [
    load,
    state.status,
    state.priority,
    state.category,
    state.keyword,
    state.sort,
  ]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const onKeywordInput = (value: string) => {
    dispatch({type: 'setKeywordInput', value});
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      dispatch({type: 'applyKeyword', value});
    }, 320);
  };

  const selectedAmount = useMemo(() => {
    const set = new Set(state.selectedIds);
    return state.list
      .filter(item => set.has(item.id))
      .reduce((sum, item) => sum + item.amount, 0);
  }, [state.list, state.selectedIds]);

  const detailTicket = useMemo(
    () => state.list.find(item => item.id === state.detailId) ?? null,
    [state.list, state.detailId],
  );

  const saveDetail = async (patch: {
    status: RnLabTicketStatus;
    priority: RnLabTicketPriority;
    note: string;
  }) => {
    if (!state.detailId) {
      return;
    }
    dispatch({type: 'mutateStart'});
    try {
      const ticket = await updateRnLabTicket(state.detailId, patch);
      dispatch({type: 'replaceTicket', ticket});
      dispatch({type: 'closeDetail'});
      await load('refresh');
      return ticket;
    } finally {
      dispatch({type: 'mutateEnd'});
    }
  };

  const batchAdvance = async () => {
    if (state.selectedIds.length === 0) {
      return {updatedIds: [] as string[], skippedIds: [] as string[]};
    }
    dispatch({type: 'mutateStart'});
    try {
      const result = await batchAdvanceRnLabTickets(state.selectedIds);
      dispatch({type: 'clearSelection'});
      await load('refresh');
      return result;
    } finally {
      dispatch({type: 'mutateEnd'});
    }
  };

  return {
    state,
    dispatch,
    load,
    onKeywordInput,
    selectedAmount,
    detailTicket,
    saveDetail,
    batchAdvance,
  };
}
