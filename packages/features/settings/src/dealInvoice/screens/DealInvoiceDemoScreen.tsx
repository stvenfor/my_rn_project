import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {DealInvoiceEmptyState} from '../components/DealInvoiceEmptyState';
import {DealInvoiceListItem} from '../components/DealInvoiceListItem';
import {DealInvoiceProfileHeader} from '../components/DealInvoiceProfileHeader';
import {
  DEAL_INVOICE_MAX_PAGES,
  fetchDealInvoicePage,
} from '../mock/dealInvoiceMockRepository';
import {
  DEAL_INVOICE_STATS_DEMO,
  DEAL_INVOICE_TABS,
  type DealInvoiceItem,
  type DealInvoiceTabId,
} from '../models/dealInvoiceModels';

type Props = RootStackScreenProps<typeof RoutePath.dealInvoiceDemo>;

interface TabState {
  items: DealInvoiceItem[];
  page: number;
  hasMore: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  loaded: boolean;
}

function createTabState(): TabState {
  return {
    items: [],
    page: 0,
    hasMore: true,
    isRefreshing: false,
    isLoadingMore: false,
    loaded: false,
  };
}

function resolveHasMore(page: number, batchLen: number): boolean {
  if (batchLen === 0) {
    return false;
  }
  if (page >= DEAL_INVOICE_MAX_PAGES - 1) {
    return false;
  }
  return true;
}

const BG = '#F5F6F8';
const ACCENT = '#3B8CFF';

/** Aligns with Flutter `DealInvoiceDemoPage`. */
export function DealInvoiceDemoScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabStates, setTabStates] = useState<TabState[]>(() =>
    DEAL_INVOICE_TABS.map(() => createTabState()),
  );
  const loadingGuard = useRef<Record<number, boolean>>({});

  const updateTab = useCallback(
    (
      index: number,
      patch: Partial<TabState> | ((prev: TabState) => TabState),
    ) => {
      setTabStates(prev =>
        prev.map((state, i) => {
          if (i !== index) {
            return state;
          }
          return typeof patch === 'function'
            ? patch(state)
            : {...state, ...patch};
        }),
      );
    },
    [],
  );

  const loadInitial = useCallback(
    async (index: number) => {
      if (loadingGuard.current[index]) {
        return;
      }
      loadingGuard.current[index] = true;
      const tab = DEAL_INVOICE_TABS[index].id as DealInvoiceTabId;
      try {
        const batch = await fetchDealInvoicePage({tab, page: 0});
        updateTab(index, {
          items: batch,
          page: 0,
          hasMore: resolveHasMore(0, batch.length),
          loaded: true,
        });
      } finally {
        loadingGuard.current[index] = false;
      }
    },
    [updateTab],
  );

  const refreshTab = useCallback(
    async (index: number) => {
      if (loadingGuard.current[index]) {
        return;
      }
      loadingGuard.current[index] = true;
      const tab = DEAL_INVOICE_TABS[index].id as DealInvoiceTabId;
      updateTab(index, {isRefreshing: true, page: 0, hasMore: true});
      try {
        const batch = await fetchDealInvoicePage({tab, page: 0});
        updateTab(index, {
          items: batch,
          page: 0,
          hasMore: resolveHasMore(0, batch.length),
          isRefreshing: false,
          loaded: true,
        });
      } finally {
        loadingGuard.current[index] = false;
        updateTab(index, {isRefreshing: false});
      }
    },
    [updateTab],
  );

  const loadMore = useCallback(
    async (index: number) => {
      const state = tabStates[index];
      if (
        !state ||
        state.isLoadingMore ||
        state.isRefreshing ||
        !state.hasMore ||
        loadingGuard.current[index]
      ) {
        return;
      }
      loadingGuard.current[index] = true;
      const nextPage = state.page + 1;
      const tab = DEAL_INVOICE_TABS[index].id as DealInvoiceTabId;
      updateTab(index, {isLoadingMore: true, page: nextPage});
      try {
        const batch = await fetchDealInvoicePage({tab, page: nextPage});
        updateTab(index, s => ({
          ...s,
          items: [...s.items, ...batch],
          hasMore: resolveHasMore(nextPage, batch.length),
          isLoadingMore: false,
        }));
      } finally {
        loadingGuard.current[index] = false;
        updateTab(index, {isLoadingMore: false});
      }
    },
    [tabStates, updateTab],
  );

  useEffect(() => {
    DEAL_INVOICE_TABS.forEach((_, i) => {
      loadInitial(i).catch(() => undefined);
    });
  }, [loadInitial]);

  const goUpload = useCallback(
    (scene: 'create' | 'detail' | 'reupload', item?: DealInvoiceItem) => {
      navigation.navigate(RoutePath.dealInvoiceUpload, {scene, item});
    },
    [navigation],
  );

  const current = tabStates[tabIndex] ?? createTabState();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
    const distance =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distance < 120) {
      loadMore(tabIndex).catch(() => undefined);
    }
  };

  return (
    <AppPageScaffold
      backgroundColor={BG}
      navBar={
        <AppNavBar
          title="新车成交"
          showBackButton
          backgroundColor="#FFFFFF"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.root}>
        <ScrollView
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}
          onScroll={onScroll}
          refreshControl={
            <RefreshControl
              refreshing={current.isRefreshing}
              onRefresh={() => {
                refreshTab(tabIndex).catch(() => undefined);
              }}
              tintColor={ACCENT}
            />
          }
          contentContainerStyle={{paddingBottom: insets.bottom + 88}}>
          <DealInvoiceProfileHeader stats={DEAL_INVOICE_STATS_DEMO} />
          <View style={styles.tabBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}>
              {DEAL_INVOICE_TABS.map((tab, index) => {
                const active = index === tabIndex;
                return (
                  <Pressable
                    key={tab.id}
                    style={styles.tabItem}
                    onPress={() => setTabIndex(index)}>
                    <Text
                      style={[
                        styles.tabLabel,
                        active ? styles.tabLabelActive : styles.tabLabelIdle,
                      ]}>
                      {tab.label}
                    </Text>
                    <View
                      style={[
                        styles.tabIndicator,
                        !active && styles.tabIndicatorHidden,
                      ]}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {current.loaded &&
          current.items.length === 0 &&
          !current.isRefreshing ? (
            <DealInvoiceEmptyState onUpload={() => goUpload('create')} />
          ) : (
            <View style={styles.listPad}>
              {current.items.map(item => (
                <DealInvoiceListItem
                  key={item.id}
                  item={item}
                  onPress={() => goUpload('detail', item)}
                  onProcess={() => goUpload('reupload', item)}
                />
              ))}
              {current.isLoadingMore ? (
                <ActivityIndicator
                  style={styles.footerSpinner}
                  color={ACCENT}
                />
              ) : null}
              {!current.hasMore && current.items.length > 0 ? (
                <Text style={styles.noMore}>没有更多了</Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        <Pressable
          style={[styles.fab, {bottom: insets.bottom + 16}]}
          onPress={() => goUpload('create')}>
          <Text style={styles.fabPlus}>＋</Text>
          <Text style={styles.fabText}>上传成交发票</Text>
        </Pressable>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  tabBar: {
    backgroundColor: BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  tabRow: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingTop: 10,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 15,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tabLabelIdle: {
    fontWeight: '400',
    color: '#757575',
  },
  tabIndicator: {
    marginTop: 8,
    height: 3,
    width: '100%',
    backgroundColor: ACCENT,
    borderRadius: 1.5,
  },
  tabIndicatorHidden: {
    backgroundColor: 'transparent',
  },
  listPad: {
    paddingTop: 8,
  },
  footerSpinner: {
    marginVertical: 16,
  },
  noMore: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9E9E9E',
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    zIndex: 10,
  },
  fabPlus: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
