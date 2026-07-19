import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const SHORTCUTS = [
  {label: '会员专享', color: '#007AFF'},
  {label: '配音专栏', color: '#FF9500'},
  {label: '其他课程', color: '#5856D6'},
  {label: '功能教程', color: '#34C759'},
] as const;

const DAILY = [
  {
    title: '带你玩转 ETF',
    tag: '直播中',
    avatar: 'https://picsum.photos/seed/v1/120/120',
  },
  {
    title: '新能源赛道解读',
    tag: '回放',
    avatar: 'https://picsum.photos/seed/v2/120/120',
  },
  {
    title: '门店短视频运营',
    tag: '直播中',
    avatar: 'https://picsum.photos/seed/v3/120/120',
  },
] as const;

const COURSES = [
  {
    title: '【配置】当星舰撞上算力',
    author: '尤国梁',
    cover: 'https://picsum.photos/seed/c1/400/240',
    isLive: true,
    isMember: true,
  },
  {
    title: '黄金恐贪定投实战',
    author: '策略组',
    cover: 'https://picsum.photos/seed/c2/400/240',
    isLive: false,
    isMember: false,
  },
] as const;

interface Props {
  onOpenDubbing: () => void;
}

export function HomeVideoTabContent({onOpenDubbing}: Props) {
  return (
    <View>
      <View style={styles.shortcutRow}>
        {SHORTCUTS.map(item => (
          <View key={item.label} style={styles.shortcut}>
            <View
              style={[
                styles.shortcutIcon,
                {backgroundColor: `${item.color}1F`},
              ]}>
              <Text style={[styles.shortcutDot, {color: item.color}]}>●</Text>
            </View>
            <Text style={styles.shortcutLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>每日推荐</Text>
          <Text style={styles.more}>更多 &gt;</Text>
        </View>
        {DAILY.map(item => {
          const isLive = item.tag === '直播中';
          return (
            <View key={item.title} style={styles.dailyRow}>
              <View
                style={[
                  styles.dailyTag,
                  isLive ? styles.dailyTagLive : styles.dailyTagReplay,
                ]}>
                <Text
                  style={[
                    styles.dailyTagText,
                    isLive
                      ? styles.dailyTagTextLive
                      : styles.dailyTagTextReplay,
                  ]}>
                  {item.tag}
                </Text>
              </View>
              <Text style={styles.dailyTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Image source={{uri: item.avatar}} style={styles.dailyAvatar} />
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门课程</Text>
          <Text style={styles.more}>更多 &gt;</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COURSES.map(course => (
            <View key={course.title} style={styles.courseCard}>
              <View>
                <Image
                  source={{uri: course.cover}}
                  style={styles.courseCover}
                />
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>
                    {course.isLive ? '直播中' : '回放'}
                  </Text>
                </View>
              </View>
              <View style={styles.courseBody}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={styles.courseAuthor}>{course.author}</Text>
                {course.isMember ? (
                  <View style={styles.memberBadge}>
                    <Text style={styles.memberBadgeText}>V 会员专属</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.dubbingEntry} onPress={onOpenDubbing}>
        <Text style={styles.dubbingText}>进入配音视频专区</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  shortcut: {flex: 1, alignItems: 'center'},
  shortcutIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutDot: {fontSize: 16},
  shortcutLabel: {
    marginTop: 8,
    fontSize: 12,
    color: t.labelPrimary,
  },
  section: {paddingHorizontal: 16, paddingTop: 24},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  more: {fontSize: 13, color: t.labelSecondary},
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
  },
  dailyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  dailyTagLive: {backgroundColor: 'rgba(255,59,48,0.08)'},
  dailyTagReplay: {backgroundColor: t.fillSecondary},
  dailyTagText: {fontSize: 11, fontWeight: '600'},
  dailyTagTextLive: {color: '#FF3B30'},
  dailyTagTextReplay: {color: t.labelSecondary},
  dailyTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: t.labelPrimary,
    marginRight: 10,
  },
  dailyAvatar: {width: 36, height: 36, borderRadius: 18},
  courseCard: {
    width: 168,
    marginRight: 12,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
    overflow: 'hidden',
  },
  courseCover: {width: 168, height: 96},
  courseBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  courseBadgeText: {color: '#fff', fontSize: 10},
  courseBody: {padding: 10},
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  courseAuthor: {marginTop: 6, fontSize: 13, color: t.labelSecondary},
  memberBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,149,0,0.08)',
  },
  memberBadgeText: {
    fontSize: 10,
    color: '#FF9500',
    fontWeight: '600',
  },
  dubbingEntry: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: t.radiusMd,
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
    alignItems: 'center',
  },
  dubbingText: {color: t.accent, fontWeight: '600'},
});
