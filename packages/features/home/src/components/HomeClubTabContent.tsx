import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const FILTERS = ['最新', '嘉宾分享', '资料'] as const;

const POSTS = [
  {
    author: '莫听官方',
    avatar: 'https://picsum.photos/seed/club1/80/80',
    date: '06-24',
    content: '【官方纪要】本期聚焦 AI 算力与产业趋势，内容仅供合格投资者参考。',
    hasPdf: true,
    pdfName: '【莫听Club第78期】聊聊AI最靓的仔.pdf',
  },
  {
    author: '策略研究员',
    avatar: 'https://picsum.photos/seed/club2/80/80',
    date: '06-20',
    content: '当星舰遇到算力：嘉宾分享回顾与延伸阅读。',
    hasPdf: false,
  },
] as const;

interface Props {
  /** Aligns with Flutter join + “进入社区查看更多” → Community. */
  onOpenCommunity?: () => void;
  /** @deprecated use onOpenCommunity */
  onJoin?: () => void;
}

export function HomeClubTabContent({onOpenCommunity, onJoin}: Props) {
  const openCommunity = onOpenCommunity ?? onJoin;

  return (
    <View>
      <View style={styles.headerCard}>
        <View style={styles.clubLogo}>
          <Text style={styles.clubLogoText}>Club</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.clubTitle}>莫听Club</Text>
          <Text style={styles.clubMeta}>动态 127 | 成员 1040</Text>
        </View>
        <Pressable style={styles.joinBtn} onPress={openCommunity}>
          <Text style={styles.joinText}>+ 加入</Text>
        </Pressable>
      </View>

      {/* Flutter filters are display-only; first tab stays active. */}
      <View style={styles.filterRow}>
        {FILTERS.map((label, index) => {
          const active = index === 0;
          return (
            <View key={label} style={styles.filterItem}>
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}>
                {label}
              </Text>
              <View
                style={[
                  styles.filterUnderline,
                  active && styles.filterUnderlineActive,
                ]}
              />
            </View>
          );
        })}
      </View>

      {POSTS.map(post => (
        <View key={post.author + post.date} style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{uri: post.avatar}} style={styles.avatar} />
            <View style={styles.flex1}>
              <Text style={styles.author}>{post.author}</Text>
              <Text style={styles.date}>{post.date}</Text>
            </View>
          </View>
          <Text style={styles.content}>{post.content}</Text>
          {post.hasPdf ? (
            <View style={styles.pdfRow}>
              <Text style={styles.pdfIcon}>📄</Text>
              <Text style={styles.pdfName} numberOfLines={1}>
                {post.pdfName}
              </Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            <Action label="分享" glyph="↗" />
            <Action label="评论" glyph="💬" />
            <Action label="点赞" glyph="♡" />
          </View>
        </View>
      ))}

      <Pressable style={styles.moreBtn} onPress={openCommunity}>
        <Text style={styles.moreText}>进入社区查看更多</Text>
      </Pressable>
    </View>
  );
}

function Action({label, glyph}: {label: string; glyph: string}) {
  return (
    <View style={styles.action}>
      <Text style={styles.actionGlyph}>{glyph}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {flex: 1},
  headerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubLogo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1C1C3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubLogoText: {color: '#fff', fontWeight: '700', fontSize: 13},
  headerText: {flex: 1, marginLeft: 12},
  clubTitle: {fontSize: 20, fontWeight: '600', color: t.labelPrimary},
  clubMeta: {marginTop: 4, fontSize: 13, color: t.labelSecondary},
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: t.accent,
  },
  joinText: {color: '#fff', fontSize: 14},
  filterRow: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  filterItem: {marginRight: 24, alignItems: 'center'},
  filterText: {fontSize: 15, color: t.labelSecondary, fontWeight: '400'},
  filterTextActive: {color: t.labelPrimary, fontWeight: '600'},
  filterUnderline: {marginTop: 6, height: 2, width: 0},
  filterUnderlineActive: {width: 20, backgroundColor: t.accent},
  post: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
  },
  postHeader: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  author: {fontSize: 15, fontWeight: '600', color: t.labelPrimary},
  date: {fontSize: 12, color: t.labelSecondary, marginTop: 2},
  content: {
    marginTop: 12,
    fontSize: 15,
    color: t.labelPrimary,
    lineHeight: 22,
  },
  pdfRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: t.fillSecondary,
  },
  pdfIcon: {marginRight: 8},
  pdfName: {flex: 1, fontSize: 13, color: t.labelPrimary},
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionGlyph: {fontSize: 14, color: t.labelSecondary, marginRight: 4},
  actionLabel: {fontSize: 13, color: t.labelSecondary},
  moreBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
    borderWidth: 0.5,
    borderColor: t.separator,
    alignItems: 'center',
  },
  moreText: {color: t.accent, fontWeight: '600', fontSize: 15},
});
