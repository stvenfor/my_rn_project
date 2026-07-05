import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {LearningHighlight} from '../data/homeReportData';
import {homeReportTheme} from '../theme/homeReportTheme';

function EmojiIconBox({emoji, gradient}: {emoji: string; gradient: boolean}) {
  return (
    <View
      style={[
        styles.iconBox,
        gradient ? styles.iconGradient : styles.iconFlat,
      ]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

function HighlightTrailing({
  trailing,
}: {
  trailing: LearningHighlight['trailing'];
}) {
  if (trailing.type === 'score') {
    return (
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreText}>{trailing.value}</Text>
      </View>
    );
  }
  if (trailing.type === 'emoji') {
    return <Text style={styles.trailingEmoji}>{trailing.value}</Text>;
  }
  return (
    <View style={styles.playBtn}>
      <Text style={styles.playIcon}>▶</Text>
    </View>
  );
}

interface Props {
  items: LearningHighlight[];
}

export function LearningReportHighlightCard({items}: Props) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <View key={item.title}>
          <View style={styles.row}>
            <EmojiIconBox emoji={item.emoji} gradient />
            <View style={styles.meta}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <HighlightTrailing trailing={item.trailing} />
          </View>
          {index < items.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: homeReportTheme.highlightBorder,
    backgroundColor: homeReportTheme.highlightCard,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradient: {backgroundColor: homeReportTheme.iconTeal},
  iconFlat: {
    backgroundColor: homeReportTheme.recordItem,
    borderWidth: 1,
    borderColor: homeReportTheme.divider,
  },
  emoji: {fontSize: 22},
  meta: {flex: 1, marginLeft: 12},
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: homeReportTheme.titleWhite,
  },
  subtitle: {fontSize: 12, color: homeReportTheme.subtitleGrey, marginTop: 4},
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: homeReportTheme.orangeDeep,
  },
  scoreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  trailingEmoji: {fontSize: 24},
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: homeReportTheme.playButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {color: homeReportTheme.dotBlue, fontSize: 16},
  divider: {
    height: 1,
    backgroundColor: homeReportTheme.divider,
    marginHorizontal: 16,
  },
});
