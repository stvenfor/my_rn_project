import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {HxbCourse} from '../../../data/rnLabHxbMockData';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';
import {HxbGradient} from './HxbGradient';

const HERO_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
};

type Props = {
  course: HxbCourse;
};

export function HxbHeroCard({course}: Props) {
  return (
    <HxbGradient
      colors={[t.heroStart, t.heroMid, t.heroEnd]}
      style={styles.card}>
      <Image source={HERO_IMAGE} style={styles.portrait} />
      <View style={styles.portraitFade} />

      <View style={styles.content}>
        <View style={styles.examTag}>
          <Text style={styles.examTagStrong}>统考</Text>
          <Text style={styles.examTagRest}>
            {' '}
            {course.major} · {course.level}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.name}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.memberBadge}>
            <Text style={styles.memberCheck}>✓</Text>
            <View>
              <Text style={styles.memberTitle}>智慧会员</Text>
              <Text style={styles.memberExpire}>{course.memberExpire}</Text>
            </View>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{course.daysToExam}天</Text>
            <Text style={styles.statLabel}>距考天数</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{course.assessScore}分</Text>
            <Text style={styles.statLabel}>学测分</Text>
          </View>
        </View>
      </View>
    </HxbGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 168,
    borderRadius: 18,
    ...t.shadow,
  },
  portrait: {
    position: 'absolute',
    right: -8,
    bottom: 0,
    width: 150,
    height: 168,
    opacity: 0.92,
  },
  portraitFade: {
    position: 'absolute',
    right: 70,
    top: 0,
    bottom: 0,
    width: 90,
    backgroundColor: 'transparent',
    borderRightWidth: 0,
    // soft blend via translucent overlays
    shadowColor: t.heroMid,
    shadowOpacity: 0.9,
    shadowRadius: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
  examTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  examTagStrong: {
    color: t.primaryDeep,
    fontSize: 11,
    fontWeight: '800',
  },
  examTagRest: {
    color: t.primaryDeep,
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    width: '68%',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.membershipBg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 14,
  },
  memberCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 16,
    backgroundColor: '#C9A45A',
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    marginRight: 6,
  },
  memberTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: t.membershipText,
  },
  memberExpire: {
    fontSize: 9,
    color: t.membershipText,
    opacity: 0.85,
  },
  stat: {
    marginRight: 16,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
});
