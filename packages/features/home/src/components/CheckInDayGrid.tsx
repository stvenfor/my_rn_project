import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {checkInMallTheme} from '../theme/checkInMallTheme';

export type CheckInStatus = 'signed' | 'today' | 'pending';

export interface CheckInDay {
  day: number;
  reward: number;
  status: CheckInStatus;
}

interface Props {
  days: CheckInDay[];
  consecutiveDays: number;
  reminderEnabled: boolean;
  onReminderChange: (value: boolean) => void;
}

export function CheckInDayGrid({
  days,
  consecutiveDays,
  reminderEnabled,
  onReminderChange,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>连签7日可得65成长值</Text>
          <Text style={styles.accumulated}>
            已累计签到{' '}
            <Text style={styles.accumulatedNum}>{consecutiveDays}</Text> 天
          </Text>
        </View>
        <View style={styles.signBtn}>
          <Text style={styles.signBtnText}>立即签到</Text>
        </View>
      </View>
      <View style={styles.dayRow}>
        {days.map(day => (
          <DayCell key={day.day} day={day} />
        ))}
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.hint}>断签或者签完需重新开始</Text>
        <View style={styles.reminderRow}>
          <Text style={styles.reminderLabel}>签到提醒</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={onReminderChange}
            trackColor={{
              false: 'rgba(153,153,153,0.3)',
              true: checkInMallTheme.primaryBlue,
            }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </View>
  );
}

function DayCell({day}: {day: CheckInDay}) {
  let bg: string = checkInMallTheme.pendingBg;
  let textColor: string = checkInMallTheme.textSecondary;
  let label = `${day.day}天`;

  if (day.status === 'signed') {
    bg = checkInMallTheme.primaryBlue;
    textColor = '#fff';
    label = '已签';
  } else if (day.status === 'today') {
    bg = checkInMallTheme.coinGold;
    textColor = '#fff';
    label = `${day.day}天`;
  }

  return (
    <View style={styles.dayCol}>
      <View style={[styles.dayBox, {backgroundColor: bg}]}>
        <Text style={[styles.reward, {color: textColor}]}>+{day.reward}</Text>
        <Text style={[styles.arrow, {color: textColor}]}>→</Text>
      </View>
      <Text
        style={[
          styles.dayLabel,
          day.status === 'signed' && styles.dayLabelSigned,
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: checkInMallTheme.cardWhite,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: checkInMallTheme.textPrimary,
  },
  accumulated: {
    fontSize: 12,
    color: checkInMallTheme.textSecondary,
    marginTop: 4,
  },
  accumulatedNum: {
    color: checkInMallTheme.primaryBlue,
    fontWeight: '600',
  },
  signBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: checkInMallTheme.primaryBlue,
  },
  signBtnText: {color: '#fff', fontSize: 14, fontWeight: '600'},
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dayCol: {alignItems: 'center'},
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reward: {fontSize: 12, fontWeight: '600'},
  arrow: {fontSize: 10, marginTop: 1},
  dayLabel: {
    fontSize: 11,
    color: checkInMallTheme.textSecondary,
    marginTop: 4,
  },
  dayLabelSigned: {color: checkInMallTheme.primaryBlue},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  hint: {fontSize: 12, color: checkInMallTheme.textHint},
  reminderRow: {flexDirection: 'row', alignItems: 'center'},
  reminderLabel: {
    fontSize: 12,
    color: checkInMallTheme.textSecondary,
    marginRight: 8,
  },
});
