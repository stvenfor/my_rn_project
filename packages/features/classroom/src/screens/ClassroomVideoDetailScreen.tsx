import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {classroomMockData} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

export function ClassroomVideoDetailScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.classroomVideoDetail>) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'intro' | 'comments'>('intro');
  const [partIndex, setPartIndex] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const parts = classroomMockData.videoAlbumParts;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.player}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.playGlyph}>▶</Text>
        <Text style={styles.playerHint}>视频占位（mock / Degraded）</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable onPress={() => setTab('intro')} style={styles.tab}>
          <Text style={[styles.tabText, tab === 'intro' && styles.tabActive]}>
            简介
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('comments')} style={styles.tab}>
          <Text
            style={[styles.tabText, tab === 'comments' && styles.tabActive]}>
            评论 22
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex1}
        contentContainerStyle={{paddingBottom: insets.bottom + 72}}>
        {tab === 'intro' ? (
          <View style={styles.pad}>
            <Text style={styles.title}>{classroomMockData.videoTitle}</Text>
            <Text style={styles.section}>选集</Text>
            {parts.map((part, index) => (
              <Pressable
                key={part.id}
                style={[styles.part, index === partIndex && styles.partActive]}
                onPress={() => setPartIndex(index)}>
                <Text
                  style={[
                    styles.partTitle,
                    index === partIndex && styles.partTitleActive,
                  ]}>
                  {part.title}
                </Text>
                {part.badge ? (
                  <Text style={styles.partBadge}>{part.badge}</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.pad}>
            <Text style={styles.comment}>暂无评论（mock）</Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Pressable
          style={styles.startBtn}
          onPress={() => setSettingsVisible(true)}>
          <Text style={styles.startText}>开始配音</Text>
        </Pressable>
      </View>

      <Modal transparent visible={settingsVisible} animationType="slide">
        <View style={styles.sheetRoot}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setSettingsVisible(false)}
          />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>配音设置</Text>
            <Text style={styles.sheetBody}>原声 / 降噪 / 评分（UI POC）</Text>
            <Pressable
              style={styles.sheetBtn}
              onPress={() => {
                setSettingsVisible(false);
                AppToast.show('开始配音（开发中）');
              }}>
              <Text style={styles.sheetBtnText}>确认</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: c.background},
  flex1: {flex: 1},
  player: {
    height: 220,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {position: 'absolute', left: 8, top: 8, width: 40, zIndex: 1},
  backText: {fontSize: 30, color: '#fff'},
  playGlyph: {fontSize: 40, color: '#fff'},
  playerHint: {marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.7)'},
  tabs: {
    flexDirection: 'row',
    backgroundColor: c.cardWhite,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.divider,
  },
  tab: {flex: 1, alignItems: 'center', paddingVertical: 12},
  tabText: {fontSize: 15, color: c.textGray},
  tabActive: {color: c.primaryGreen, fontWeight: '700'},
  pad: {padding: 16},
  title: {fontSize: 16, fontWeight: '600', color: c.titleBlack, lineHeight: 24},
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    color: c.titleBlack,
  },
  part: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: c.cardWhite,
    flexDirection: 'row',
    alignItems: 'center',
  },
  partActive: {backgroundColor: c.primaryGreenLight},
  partTitle: {flex: 1, fontSize: 14, color: c.titleBlack},
  partTitleActive: {color: c.primaryGreen, fontWeight: '600'},
  partBadge: {fontSize: 11, color: c.orange, fontWeight: '600'},
  comment: {fontSize: 14, color: c.textGray},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: c.cardWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.divider,
  },
  startBtn: {
    height: 48,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  sheetRoot: {flex: 1, justifyContent: 'flex-end'},
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    zIndex: 1,
    backgroundColor: c.cardWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  sheetTitle: {fontSize: 16, fontWeight: '700', color: c.titleBlack},
  sheetBody: {marginTop: 12, fontSize: 14, color: c.textGray},
  sheetBtn: {
    marginTop: 20,
    height: 44,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBtnText: {color: '#fff', fontWeight: '600'},
});
