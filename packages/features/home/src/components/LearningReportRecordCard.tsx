import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {LearningRecord} from '../data/homeReportData';
import {homeReportTheme} from '../theme/homeReportTheme';

function EmojiIconBox({emoji}: {emoji: string}) {
  return (
    <View style={styles.iconBox}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

interface Props {
  items: LearningRecord[];
}

export function LearningReportRecordCard({items}: Props) {
  return (
    <View style={styles.card}>
      {items.map(item => (
        <View key={`${item.title}-${item.time}`} style={styles.rowWrap}>
          <View style={styles.row}>
            <EmojiIconBox emoji={item.emoji} />
            <View style={styles.meta}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <View style={styles.timeCol}>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: homeReportTheme.recordCard,
    borderRadius: 16,
  },
  rowWrap: {marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: homeReportTheme.recordItem,
    borderRadius: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: homeReportTheme.recordItem,
    borderWidth: 1,
    borderColor: homeReportTheme.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 22},
  meta: {flex: 1, marginLeft: 12},
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: homeReportTheme.titleWhite,
  },
  subtitle: {fontSize: 12, color: homeReportTheme.subtitleGrey, marginTop: 4},
  timeCol: {alignItems: 'flex-end'},
  time: {fontSize: 12, color: homeReportTheme.metaGrey},
  status: {fontSize: 12, color: homeReportTheme.metaGrey, marginTop: 4},
  statusHighlight: {color: homeReportTheme.orange, fontWeight: '600'},
});
