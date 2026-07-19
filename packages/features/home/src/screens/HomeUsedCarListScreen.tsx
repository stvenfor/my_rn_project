import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {AppNavBar} from '@ui/design-system/AppNavBar';
import {AppPageScaffold} from '@ui/design-system/AppPageScaffold';
import {
  fetchTransactionPage,
  formatTransactionAmount,
  isExpenseType,
  isIncomeType,
  type TransactionModel,
} from '../services/transactionApi';

export function HomeUsedCarListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeUsedCarList>) {
  const [list, setList] = useState<TransactionModel[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(
    async (nextPage: number, mode: 'init' | 'refresh' | 'more') => {
      try {
        if (mode === 'init') {
          setLoading(true);
          setError(null);
        }
        if (mode === 'refresh') {
          setRefreshing(true);
        }
        if (mode === 'more') {
          setLoadingMore(true);
        }
        const result = await fetchTransactionPage({page: nextPage});
        setPage(nextPage);
        setList(prev =>
          nextPage === 0 ? result.list : [...prev, ...result.list],
        );
        setHasMore(result.list.length >= 20);
      } catch (e) {
        const message = e instanceof Error ? e.message : '加载失败';
        if (mode === 'refresh') {
          AppToast.show('刷新失败');
        } else if (mode === 'more') {
          AppToast.show('加载更多失败');
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    load(0, 'init');
  }, [load]);

  return (
    <AppPageScaffold layout="standard" backgroundColor="#F5F6F8">
      <AppNavBar title="二手车" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Pressable style={styles.center} onPress={() => load(0, 'init')}>
          <Text style={styles.error}>加载失败</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <Text style={styles.retry}>点击重试</Text>
        </Pressable>
      ) : list.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>暂无交易记录</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{paddingTop: 12, paddingBottom: 24}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(0, 'refresh')}
            />
          }
          onEndReached={() => {
            if (!loadingMore && hasMore) {
              load(page + 1, 'more');
            }
          }}
          renderItem={({item}) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate(RoutePath.homeUsedCarDetail, {id: item.id})
              }>
              <View style={styles.row}>
                <Text style={styles.category}>{item.category}</Text>
                <View
                  style={[
                    styles.tag,
                    isIncomeType(item.type)
                      ? styles.income
                      : isExpenseType(item.type)
                      ? styles.expense
                      : styles.other,
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      isIncomeType(item.type)
                        ? {color: '#2E7D32'}
                        : isExpenseType(item.type)
                        ? {color: '#C62828'}
                        : {color: '#1565C0'},
                    ]}>
                    {item.type}
                  </Text>
                </View>
              </View>
              <Text style={styles.amount}>
                {formatTransactionAmount(item.amount)}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </Pressable>
          )}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{marginVertical: 12}} />
            ) : null
          }
        />
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {fontSize: 16, color: '#E53935', fontWeight: '600'},
  errorDetail: {marginTop: 8, color: '#666', textAlign: 'center'},
  retry: {marginTop: 12, color: '#007AFF'},
  empty: {color: '#999'},
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {fontSize: 16, fontWeight: '600', color: '#1A1A1A'},
  tag: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4},
  income: {backgroundColor: '#E8F5E9'},
  expense: {backgroundColor: '#FFEBEE'},
  other: {backgroundColor: '#E3F2FD'},
  tagText: {fontSize: 12, fontWeight: '600'},
  amount: {marginTop: 8, fontSize: 22, fontWeight: '700', color: '#1A1A1A'},
  date: {marginTop: 6, fontSize: 13, color: '#999'},
});
