import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import type {CheckInDay} from '../components/CheckInDayGrid';
import {CheckInDayGrid} from '../components/CheckInDayGrid';
import {CheckInMallHeader} from '../components/CheckInMallHeader';
import type {GrowthTask} from '../components/GrowthTaskList';
import {GrowthTaskList} from '../components/GrowthTaskList';
import {GiftSectionPlaceholder} from '../components/GiftSectionPlaceholder';
import {checkInMallTheme} from '../theme/checkInMallTheme';

const CHECK_IN_DAYS: CheckInDay[] = [
  {day: 1, reward: 5, status: 'signed'},
  {day: 2, reward: 5, status: 'today'},
  {day: 3, reward: 10, status: 'pending'},
  {day: 4, reward: 5, status: 'pending'},
  {day: 5, reward: 5, status: 'pending'},
  {day: 6, reward: 5, status: 'pending'},
  {day: 7, reward: 20, status: 'pending'},
];

const MALL_TASKS: GrowthTask[] = [
  {
    icon: '↑',
    title: '每日登录',
    subtitle: '+10成长值 +5i车币',
    actionText: '去完成',
    actionType: 'primary',
  },
  {
    icon: '💬',
    title: '回复客户消息',
    subtitle: '+50成长值 +20i车币',
    actionText: '已完成',
    actionType: 'completed',
    showHelp: true,
  },
  {
    icon: '👤',
    title: '邀请新销售顾问',
    subtitle: '+200成长值 +50i车币',
    actionText: '去邀请',
    actionType: 'primary',
  },
];

export function HomeCheckInMallScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [reminder, setReminder] = useState(false);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <CheckInMallHeader
        title={t('checkInMall')}
        onBack={() => navigation.goBack()}
        consecutiveDays={26}
        iCarCoins={320}
        growthValue={780}
      />
      <CheckInDayGrid
        days={CHECK_IN_DAYS}
        consecutiveDays={26}
        reminderEnabled={reminder}
        onReminderChange={setReminder}
      />
      <GrowthTaskList tasks={MALL_TASKS} />
      <GiftSectionPlaceholder />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: checkInMallTheme.background},
  content: {paddingBottom: 24},
});
