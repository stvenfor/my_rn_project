import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  RN_LAB_CATEGORIES,
  RN_LAB_PRIORITIES,
  RN_LAB_STATUS_TABS,
  type RnLabTicketCategory,
  type RnLabTicketPriority,
  type RnLabTicketStatus,
} from '../../data/rnLabLayoutMockData';
import type {RnLabSortKey} from '../../services/rnLabLayoutRepository';
import {homeDashboardTheme as t} from '../../theme/homeDashboardTheme';

interface Props {
  keywordInput: string;
  onKeywordInput: (value: string) => void;
  status: RnLabTicketStatus | 'all';
  statusCounts: Record<RnLabTicketStatus | 'all', number>;
  onStatus: (value: RnLabTicketStatus | 'all') => void;
  priority: RnLabTicketPriority | 'all';
  onPriority: (value: RnLabTicketPriority | 'all') => void;
  category: RnLabTicketCategory | 'all';
  onCategory: (value: RnLabTicketCategory | 'all') => void;
  sort: RnLabSortKey;
  onSort: (value: RnLabSortKey) => void;
  selecting: boolean;
  onToggleSelecting: () => void;
  onSelectAllVisible: () => void;
  total: number;
}

const SORT_OPTIONS: {key: RnLabSortKey; label: string}[] = [
  {key: 'slaAsc', label: 'SLA↑'},
  {key: 'amountDesc', label: '金额↓'},
  {key: 'updatedDesc', label: '更新↓'},
];

export function RnLabFilterBar({
  keywordInput,
  onKeywordInput,
  status,
  statusCounts,
  onStatus,
  priority,
  onPriority,
  category,
  onCategory,
  sort,
  onSort,
  selecting,
  onToggleSelecting,
  onSelectAllVisible,
  total,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchRow}>
        <TextInput
          value={keywordInput}
          onChangeText={onKeywordInput}
          placeholder="搜索单号 / 客户 / 负责人 / 标签"
          placeholderTextColor={t.labelTertiary}
          style={styles.search}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <Pressable style={styles.modeBtn} onPress={onToggleSelecting}>
          <Text style={styles.modeBtnText}>
            {selecting ? '完成' : '多选'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}>
        {RN_LAB_STATUS_TABS.map(tab => {
          const active = status === tab.key;
          const count = statusCounts[tab.key] ?? 0;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => onStatus(tab.key)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label} {count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        <Chip
          label="优先级全部"
          active={priority === 'all'}
          onPress={() => onPriority('all')}
        />
        {RN_LAB_PRIORITIES.map(item => (
          <Chip
            key={item}
            label={item}
            active={priority === item}
            onPress={() => onPriority(item)}
          />
        ))}
        <View style={styles.chipDivider} />
        <Chip
          label="类目全部"
          active={category === 'all'}
          onPress={() => onCategory('all')}
        />
        {RN_LAB_CATEGORIES.map(item => (
          <Chip
            key={item}
            label={item}
            active={category === item}
            onPress={() => onCategory(item)}
          />
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        <Text style={styles.totalText}>共 {total} 条</Text>
        <View style={styles.sortGroup}>
          {SORT_OPTIONS.map(option => (
            <Pressable
              key={option.key}
              style={[styles.sortBtn, sort === option.key && styles.sortActive]}
              onPress={() => onSort(option.key)}>
              <Text
                style={[
                  styles.sortText,
                  sort === option.key && styles.sortTextActive,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {selecting ? (
          <Pressable onPress={onSelectAllVisible}>
            <Text style={styles.selectAll}>全选本页</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: t.background,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.separator,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  search: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: t.cardWhite,
    color: t.titleBlack,
    fontSize: 14,
  },
  modeBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.primaryBlue,
  },
  modeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tabRow: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginHorizontal: 4,
    backgroundColor: t.cardWhite,
  },
  tabActive: {
    backgroundColor: t.primaryBlue,
  },
  tabText: {
    fontSize: 13,
    color: t.textDarkGray,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  chipRow: {
    paddingHorizontal: 12,
    paddingTop: 10,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: t.cardWhite,
  },
  chipActive: {
    backgroundColor: 'rgba(0,122,255,0.14)',
  },
  chipText: {
    fontSize: 12,
    color: t.textGray,
  },
  chipTextActive: {
    color: t.primaryBlue,
    fontWeight: '700',
  },
  chipDivider: {
    width: 1,
    height: 16,
    backgroundColor: t.separator,
    marginHorizontal: 6,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 12,
    color: t.textGray,
    marginRight: 8,
  },
  sortGroup: {
    flexDirection: 'row',
    flex: 1,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  sortActive: {
    backgroundColor: t.cardWhite,
  },
  sortText: {
    fontSize: 12,
    color: t.textGray,
  },
  sortTextActive: {
    color: t.primaryBlue,
    fontWeight: '700',
  },
  selectAll: {
    fontSize: 12,
    color: t.primaryBlue,
    fontWeight: '600',
  },
});
