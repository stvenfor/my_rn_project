import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  fetchTransactionById,
  formatTransactionAmount,
  type TransactionModel,
} from '../services/transactionApi';

function copyText(text: string) {
  try {
    // Optional dependency across platforms.

    const Clip = require('@react-native-clipboard/clipboard').default;
    Clip?.setString?.(text);
    return;
  } catch {
    // ignore
  }
  try {
    const {Clipboard} = require('react-native');
    Clipboard?.setString?.(text);
  } catch {
    // ignore
  }
}

export function HomeUsedCarDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.homeUsedCarDetail>) {
  const id = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<TransactionModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (id == null || Number.isNaN(Number(id))) {
        setError('无效的记录 ID');
        setLoading(false);
        return;
      }
      try {
        const data = await fetchTransactionById(Number(id));
        if (!cancelled) {
          setItem(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '记录不存在');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppPageScaffold layout="standard" backgroundColor="#F5F6F8">
      <AppNavBar title="交易详情" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error || !item ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error ?? '记录不存在'}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.card}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.amount}>
              {formatTransactionAmount(item.amount)}
            </Text>
            <Text style={styles.id}>#{item.id}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>基本信息</Text>
            <Row label="类型" value={item.type} />
            <Row label="分类" value={item.category} />
            <Row label="日期" value={item.date} />
            {item.userId ? <Row label="用户 ID" value={item.userId} /> : null}
          </View>

          {item.note ? (
            <View style={styles.card}>
              <View style={styles.noteHeader}>
                <Text style={styles.section}>备注</Text>
                <Pressable
                  onPress={() => {
                    copyText(item.note ?? '');
                    AppToast.show('已复制备注');
                  }}>
                  <Text style={styles.copy}>复制</Text>
                </Pressable>
              </View>
              <Text style={styles.note}>{item.note}</Text>
            </View>
          ) : null}

          {(item.createdAt || item.updatedAt) && (
            <View style={styles.card}>
              <Text style={styles.section}>时间信息</Text>
              {item.createdAt ? (
                <Row label="创建" value={item.createdAt} />
              ) : null}
              {item.updatedAt ? (
                <Row label="更新" value={item.updatedAt} />
              ) : null}
            </View>
          )}
        </ScrollView>
      )}
    </AppPageScaffold>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  error: {color: '#E53935'},
  body: {padding: 16, paddingBottom: 32},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  category: {fontSize: 16, fontWeight: '600', color: '#1A1A1A'},
  amount: {marginTop: 8, fontSize: 32, fontWeight: '700', color: '#1A1A1A'},
  id: {marginTop: 6, fontSize: 13, color: '#999'},
  section: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {fontSize: 14, color: '#999'},
  value: {fontSize: 14, color: '#1A1A1A'},
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: {color: '#1B82D2', fontSize: 14},
  note: {marginTop: 4, fontSize: 14, color: '#1A1A1A', lineHeight: 20},
});
