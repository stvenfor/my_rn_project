import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const FILTERS = ['最新', '嘉宾分享', '资料'];

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
];

interface Props {
  onJoin?: () => void;
}

export function HomeClubTabContent({onJoin}: Props) {
  const [filter, setFilter] = useState(0);

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
        <Pressable style={styles.joinBtn} onPress={onJoin}>
          <Text style={styles.joinText}>+ 加入</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}>
        {FILTERS.map((label, index) => {
          const active = index === filter;
          return (
            <Pressable
              key={label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(index)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {POSTS.map(post => (
        <View key={post.author + post.date} style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{uri: post.avatar}} style={styles.avatar} />
            <View style={{flex: 1}}>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  filterScroll: {marginTop: 12, maxHeight: 36},
  filterRow: {paddingHorizontal: 16, alignItems: 'center'},
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: t.fillSecondary,
    justifyContent: 'center',
    marginRight: 8,
  },
  chipActive: {backgroundColor: t.accent},
  chipText: {fontSize: 13, color: t.labelPrimary},
  chipTextActive: {color: '#fff', fontWeight: '600'},
  post: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: t.radiusMd,
    backgroundColor: t.surface,
  },
  postHeader: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 36, height: 36, borderRadius: 18, marginRight: 10},
  author: {fontSize: 15, fontWeight: '600', color: t.labelPrimary},
  date: {fontSize: 12, color: t.labelSecondary, marginTop: 2},
  content: {marginTop: 10, fontSize: 15, color: t.labelPrimary, lineHeight: 22},
  pdfRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: t.fillSecondary,
  },
  pdfIcon: {marginRight: 8},
  pdfName: {flex: 1, fontSize: 13, color: t.labelPrimary},
});
