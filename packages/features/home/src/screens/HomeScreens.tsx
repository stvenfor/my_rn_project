import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {
  RoutePath,
  type MainTabScreenProps,
  type RootStackScreenProps,
} from '@core/navigation';
import {
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  spacing,
  typography,
} from '@ui/design-system';
import {homeServiceIcons} from '../assets/homeAssets';
import {catalogSections, defaultFavoriteItems} from '../data/allServicesData';
import {
  learningHighlights,
  learningRecords,
  learningStats,
} from '../data/homeReportData';
import {
  loadHomeDashboard,
  selectHomeBanners,
  selectHomeError,
  selectHomeLoading,
} from '../homeSlice';

type HomeDispatch = ThunkDispatch<
  {home: {banners: unknown[]; loading: boolean; error: string | null}},
  unknown,
  UnknownAction
>;

export function HomeScreen({navigation}: MainTabScreenProps<'HomeTab'>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<HomeDispatch>();
  const banners = useSelector(selectHomeBanners);
  const loading = useSelector(selectHomeLoading);
  const error = useSelector(selectHomeError);

  useEffect(() => {
    dispatch(loadHomeDashboard());
  }, [dispatch]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('homeTitle')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={banners}
        keyExtractor={item => item.url}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(loadHomeDashboard())}
          />
        }
        ListHeaderComponent={
          <View style={styles.actions}>
            <PrimaryButton
              title={t('learningReport')}
              onPress={() => navigation.navigate(RoutePath.homeLearningReport)}
            />
            <View style={styles.gap} />
            <PrimaryButton
              title={t('checkInMall')}
              onPress={() => navigation.navigate(RoutePath.homeCheckInMall)}
            />
            <View style={styles.gap} />
            <PrimaryButton
              title={t('allServices')}
              onPress={() => navigation.navigate(RoutePath.homeAllServices)}
            />
          </View>
        }
        renderItem={({item}) => (
          <ListRow title={item.title} subtitle={item.url} />
        )}
      />
    </ScreenContainer>
  );
}

export function HomeLearningReportScreen() {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={t('learningReport')} />
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningStats.studyMinutes}</Text>
          <Text style={styles.statLabel}>学习分钟</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningStats.completedTasks}</Text>
          <Text style={styles.statLabel}>完成任务</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningStats.streakDays}</Text>
          <Text style={styles.statLabel}>连续打卡</Text>
        </View>
      </View>
      <Text style={styles.sectionLabel}>今日亮点</Text>
      {learningHighlights.map(item => (
        <View key={item.title} style={styles.highlightCard}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={styles.highlightBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
          </View>
          {item.trailing.type === 'score' ? (
            <Text style={styles.score}>{item.trailing.value}</Text>
          ) : item.trailing.type === 'emoji' ? (
            <Text style={styles.emoji}>{item.trailing.value}</Text>
          ) : (
            <Text style={styles.playBtn}>▶</Text>
          )}
        </View>
      ))}
      <Text style={styles.sectionLabel}>学习记录</Text>
      {learningRecords.map(item => (
        <View key={`${item.title}-${item.time}`} style={styles.recordRow}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={styles.recordBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
          </View>
          <View style={styles.recordMeta}>
            <Text style={styles.time}>{item.time}</Text>
            <Text
              style={[
                styles.status,
                item.statusHighlight && styles.statusHighlight,
              ]}>
              {item.status}
            </Text>
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

const CHECK_IN_DAYS = [
  {day: 1, reward: 5, status: 'signed'},
  {day: 2, reward: 5, status: 'today'},
  {day: 3, reward: 10, status: 'pending'},
  {day: 4, reward: 5, status: 'pending'},
  {day: 5, reward: 5, status: 'pending'},
  {day: 6, reward: 5, status: 'pending'},
  {day: 7, reward: 20, status: 'pending'},
];

const MALL_TASKS = [
  {title: '每日登录', subtitle: '+10成长值 +5i车币', action: '去完成'},
  {title: '回复客户消息', subtitle: '+50成长值 +20i车币', action: '已完成'},
  {title: '邀请新销售顾问', subtitle: '+200成长值 +50i车币', action: '去邀请'},
];

export function HomeCheckInMallScreen() {
  const {t} = useTranslation();
  const [reminder, setReminder] = React.useState(false);

  return (
    <ScrollView
      style={styles.mallScroll}
      contentContainerStyle={styles.mallContent}>
      <View style={styles.mallHeader}>
        <Text style={styles.mallTitle}>{t('checkInMall')}</Text>
        <Text style={styles.mallNotice}>连续签到 26 天，今日奖励 +5 i车币</Text>
        <View style={styles.mallStats}>
          <Text style={styles.mallStat}>i车币 320</Text>
          <Text style={styles.mallStat}>成长值 780</Text>
        </View>
      </View>
      <View style={styles.checkInCard}>
        <Text style={styles.sectionLabel}>本周签到</Text>
        <View style={styles.dayRow}>
          {CHECK_IN_DAYS.map(d => (
            <View
              key={d.day}
              style={[
                styles.dayCell,
                d.status === 'today' && styles.dayToday,
                d.status === 'signed' && styles.daySigned,
              ]}>
              <Text style={styles.dayNum}>Day {d.day}</Text>
              <Text style={styles.dayReward}>+{d.reward}</Text>
            </View>
          ))}
        </View>
        <View style={styles.reminderRow}>
          <Text style={styles.cardSub}>签到提醒</Text>
          <Switch value={reminder} onValueChange={setReminder} />
        </View>
      </View>
      <Text style={styles.sectionLabel}>成长任务</Text>
      {MALL_TASKS.map(task => (
        <View key={task.title} style={styles.taskCard}>
          <View style={styles.taskBody}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardSub}>{task.subtitle}</Text>
          </View>
          <Text style={styles.taskAction}>{task.action}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function HomeAllServicesScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeAllServices>) {
  const {t} = useTranslation();

  const openService = (item: (typeof defaultFavoriteItems)[number]) => {
    if (item.templateId) {
      navigation.navigate(RoutePath.bfuiTemplate, {
        templateId: item.templateId,
      });
      return;
    }
    if (item.routePath === RoutePath.musicList) {
      navigation.navigate(RoutePath.musicList);
    } else if (item.routePath === RoutePath.shortVideo) {
      navigation.navigate(RoutePath.shortVideo);
    }
  };

  return (
    <ScreenContainer>
      <SectionTitle title={t('allServices')} />
      <Text style={styles.sectionLabel}>常用服务</Text>
      <View style={styles.serviceGrid}>
        {defaultFavoriteItems.map(item => (
          <Pressable
            key={item.id}
            style={styles.serviceItem}
            onPress={() => openService(item)}>
            <Image
              source={homeServiceIcons[item.assetName]}
              style={styles.serviceIcon}
            />
            <Text style={styles.serviceLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      {catalogSections.map(section => (
        <View key={section.title}>
          <Text style={styles.sectionLabel}>{section.title}</Text>
          <View style={styles.serviceGrid}>
            {section.items.map(item => (
              <Pressable
                key={item.id}
                style={styles.serviceItem}
                onPress={() => openService(item)}>
                <Image
                  source={homeServiceIcons[item.assetName]}
                  style={styles.serviceIcon}
                />
                <Text style={styles.serviceLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {marginBottom: spacing.md},
  gap: {height: spacing.sm},
  error: {color: colors.error, marginBottom: spacing.sm},
  statsRow: {flexDirection: 'row', marginBottom: spacing.md},
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    marginRight: spacing.xs,
  },
  statValue: {...typography.title, color: colors.primary},
  statLabel: {...typography.caption, marginTop: 4},
  sectionLabel: {
    ...typography.subtitle,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  emoji: {fontSize: 24, marginRight: spacing.sm},
  highlightBody: {flex: 1},
  cardTitle: {...typography.body, fontWeight: '600'},
  cardSub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  score: {...typography.title, color: colors.primary},
  playBtn: {fontSize: 20, color: colors.primary},
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  recordBody: {flex: 1},
  recordMeta: {alignItems: 'flex-end'},
  time: {...typography.caption},
  status: {...typography.caption, color: colors.textSecondary},
  statusHighlight: {color: colors.primary, fontWeight: '600'},
  mallScroll: {flex: 1},
  mallContent: {paddingBottom: spacing.lg},
  mallHeader: {
    backgroundColor: '#4A90E2',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  mallTitle: {...typography.title, color: '#fff'},
  mallNotice: {...typography.caption, color: '#E8F1FA', marginTop: spacing.xs},
  mallStats: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm},
  mallStat: {...typography.body, color: '#fff', fontWeight: '600'},
  checkInCard: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dayRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs},
  dayCell: {
    width: 72,
    padding: spacing.xs,
    borderRadius: 6,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  dayToday: {borderWidth: 2, borderColor: colors.primary},
  daySigned: {backgroundColor: '#E8F5E9'},
  dayNum: {...typography.caption, fontWeight: '600'},
  dayReward: {...typography.caption, color: colors.primary},
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  taskBody: {flex: 1},
  taskAction: {...typography.caption, color: colors.primary, fontWeight: '600'},
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  serviceItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  serviceIcon: {width: 40, height: 40, marginBottom: spacing.xs},
  serviceLabel: {...typography.caption, textAlign: 'center'},
});
