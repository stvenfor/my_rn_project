import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  formatDealInvoiceDateTime,
  type DealInvoiceItem,
  type DealInvoiceStatus,
} from '../models/dealInvoiceModels';

export function DealInvoiceListItem({
  item,
  onPress,
  onProcess,
}: {
  item: DealInvoiceItem;
  onPress: () => void;
  onProcess: () => void;
}) {
  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.phoneRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>成交手机</Text>
          </View>
          <Text style={styles.phone} numberOfLines={1}>
            {item.phone}
          </Text>
        </View>
        <StatusLabel status={item.status} />
      </View>
      <Text style={styles.time}>
        提交时间: {formatDealInvoiceDateTime(item.submittedAt)}
      </Text>
      {item.status === 'rejected' && item.rejectReason ? (
        <>
          <Text style={styles.reject} numberOfLines={2}>
            未通过原因: {item.rejectReason}
          </Text>
          <Pressable style={styles.processBtn} onPress={onProcess}>
            <Text style={styles.processText}>处理</Text>
            <Text style={styles.processChevron}>›</Text>
          </Pressable>
        </>
      ) : null}
    </Pressable>
  );
}

function StatusLabel({status}: {status: DealInvoiceStatus}) {
  switch (status) {
    case 'rated':
      return (
        <Text style={styles.status}>
          <Text style={styles.statusMuted}>已评价 </Text>
          <Text style={styles.statusWarn}>5星</Text>
        </Text>
      );
    case 'approvedPendingRating':
      return (
        <Text style={styles.status}>
          <Text style={styles.statusOk}>已审核 </Text>
          <Text style={styles.statusWarn}>待评价</Text>
        </Text>
      );
    case 'pendingReview':
      return <Text style={[styles.status, styles.statusWarn]}>待审核</Text>;
    case 'rejected':
      return <Text style={[styles.status, styles.statusError]}>未通过</Text>;
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  cardPressed: {
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phoneRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#616161',
  },
  phone: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  status: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusMuted: {color: '#666666', fontWeight: '500'},
  statusOk: {color: '#52C41A', fontWeight: '500'},
  statusWarn: {color: '#FAAD14', fontWeight: '500'},
  statusError: {color: '#E53935', fontWeight: '500'},
  time: {
    marginTop: 10,
    fontSize: 12,
    color: '#757575',
  },
  reject: {
    marginTop: 10,
    fontSize: 13,
    color: '#E53935',
    lineHeight: 18,
  },
  processBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B8CFF',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  processText: {
    fontSize: 13,
    color: '#3B8CFF',
  },
  processChevron: {
    marginLeft: 2,
    fontSize: 16,
    color: '#3B8CFF',
    marginTop: -1,
  },
});
