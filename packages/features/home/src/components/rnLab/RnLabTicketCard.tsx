import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  formatRnLabAmount,
  rnLabStatusLabel,
  type RnLabTicket,
} from '../../data/rnLabLayoutMockData';
import {homeDashboardTheme as t} from '../../theme/homeDashboardTheme';

interface Props {
  ticket: RnLabTicket;
  selecting: boolean;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
}

function priorityColor(priority: RnLabTicket['priority']): string {
  switch (priority) {
    case 'P0':
      return '#FF3B30';
    case 'P1':
      return '#FF9500';
    case 'P2':
      return '#007AFF';
    default:
      return '#8E8E93';
  }
}

function slaTone(hours: number, status: RnLabTicket['status']): string {
  if (status === 'done') {
    return t.textGray;
  }
  if (hours <= 4) {
    return '#FF3B30';
  }
  if (hours <= 12) {
    return '#FF9500';
  }
  return '#34C759';
}

export function RnLabTicketCard({
  ticket,
  selecting,
  selected,
  onPress,
  onLongPress,
  onToggleSelect,
}: Props) {
  const ribbon = priorityColor(ticket.priority);
  const slaColor = slaTone(ticket.slaHoursLeft, ticket.status);

  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={selecting ? onToggleSelect : onPress}
      onLongPress={onLongPress}>
      <View style={[styles.ribbon, {backgroundColor: ribbon}]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          {selecting ? (
            <Pressable
              onPress={onToggleSelect}
              style={[styles.checkbox, selected && styles.checkboxOn]}>
              <Text style={styles.checkboxText}>{selected ? '✓' : ''}</Text>
            </Pressable>
          ) : null}
          <View style={styles.titleBlock}>
            <Text style={styles.id}>{ticket.id}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {ticket.title}
            </Text>
          </View>
          <View style={[styles.statusPill, statusStyle(ticket.status)]}>
            <Text style={styles.statusText}>
              {rnLabStatusLabel(ticket.status)}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{ticket.customer}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{ticket.assignee}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{ticket.category}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${Math.min(100, Math.max(0, ticket.progress))}%`},
            ]}
          />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.amount}>{formatRnLabAmount(ticket.amount)}</Text>
          <Text style={[styles.sla, {color: slaColor}]}>
            {ticket.status === 'done'
              ? 'SLA 已关闭'
              : `SLA ${ticket.slaHoursLeft}h`}
          </Text>
        </View>

        <View style={styles.tags}>
          {ticket.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          <Text style={styles.updated}>{ticket.updatedAt}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function statusStyle(status: RnLabTicket['status']) {
  switch (status) {
    case 'pending':
      return styles.statusPending;
    case 'processing':
      return styles.statusProcessing;
    case 'blocked':
      return styles.statusBlocked;
    case 'done':
      return styles.statusDone;
    default:
      return styles.statusPending;
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: t.cardWhite,
    overflow: 'hidden',
    flexDirection: 'row',
    ...t.cardShadow,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: t.primaryBlue,
  },
  ribbon: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: t.separator,
    marginRight: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: t.primaryBlue,
    borderColor: t.primaryBlue,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
    marginRight: 8,
  },
  id: {
    fontSize: 11,
    color: t.textGray,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: t.titleBlack,
    lineHeight: 20,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPending: {backgroundColor: 'rgba(0,122,255,0.12)'},
  statusProcessing: {backgroundColor: 'rgba(255,149,0,0.16)'},
  statusBlocked: {backgroundColor: 'rgba(255,59,48,0.12)'},
  statusDone: {backgroundColor: 'rgba(52,199,89,0.14)'},
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: t.textDarkGray,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 12,
    color: t.textGray,
  },
  dot: {
    marginHorizontal: 4,
    color: t.separator,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: t.fillSecondary,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: t.primaryBlue,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: t.titleBlack,
  },
  sla: {
    fontSize: 12,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  tag: {
    backgroundColor: t.fillSecondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: t.textDarkGray,
  },
  updated: {
    marginLeft: 'auto',
    fontSize: 11,
    color: t.labelTertiary,
  },
});
