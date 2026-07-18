import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {classroomMockData, type ClassInfo} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

export function MyClassListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.classroomMyClass>) {
  return (
    <AppPageScaffold layout="standard" backgroundColor={c.background}>
      <AppNavBar
        title="我的班级"
        onBack={() => navigation.goBack()}
        backgroundColor={c.background}
      />
      <View style={styles.root}>
        <View style={styles.toolbar}>
          <Text style={styles.swap}>⇄</Text>
          <Text style={styles.toolbarTitle}>班级</Text>
          <Pressable
            onPress={() => AppToast.show('禁用班级功能开发中')}
            style={styles.disableBtn}>
            <Text style={styles.disable}>禁用班级</Text>
          </Pressable>
        </View>
        <FlatList
          data={classroomMockData.classes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <ClassCard
              classInfo={item}
              onInvite={() => AppToast.show('邀请同学功能开发中')}
              onStats={() =>
                navigation.navigate(RoutePath.classroomHomeworkStats, {
                  classId: item.id,
                })
              }
              onRank={() => AppToast.show('排行榜功能开发中')}
              onReview={() =>
                navigation.navigate(RoutePath.classroomHomeworkReview)
              }
            />
          )}
        />
        <View style={styles.footer}>
          <Pressable
            style={styles.createBtn}
            onPress={() => AppToast.show('创建班级功能开发中')}>
            <Text style={styles.createText}>创建班级</Text>
          </Pressable>
        </View>
      </View>
    </AppPageScaffold>
  );
}

function ClassCard({
  classInfo,
  onInvite,
  onStats,
  onRank,
  onReview,
}: {
  classInfo: ClassInfo;
  onInvite: () => void;
  onStats: () => void;
  onRank: () => void;
  onReview: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.className}>{classInfo.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>邀请码：{classInfo.inviteCode}</Text>
          <Text style={styles.meta}>班级成员：{classInfo.memberCount}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.actions}>
        <ActionButton label="邀请同学" icon="＋" onPress={onInvite} />
        <ActionButton label="作业统计" icon="◎" onPress={onStats} />
        <ActionButton label="排行榜" icon="▲" onPress={onRank} />
      </View>
      <Pressable onPress={onReview} style={styles.reviewLink}>
        <Text style={styles.reviewText}>作业点评 ›</Text>
      </Pressable>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionBtn} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  swap: {color: c.primaryGreen, fontSize: 18},
  toolbarTitle: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: c.titleBlack,
  },
  disable: {fontSize: 14, color: c.primaryGreen},
  disableBtn: {marginLeft: 'auto'},
  list: {padding: 16, paddingBottom: 8},
  card: {
    backgroundColor: c.cardWhite,
    borderRadius: d.cardRadius,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  cardBody: {padding: 16},
  className: {fontSize: 18, fontWeight: '600', color: c.titleBlack},
  metaRow: {flexDirection: 'row', marginTop: 8},
  meta: {flex: 1, fontSize: 13, color: c.textGray},
  divider: {height: 1, backgroundColor: c.divider},
  actions: {flexDirection: 'row'},
  actionBtn: {flex: 1, alignItems: 'center', paddingVertical: 12},
  actionIcon: {fontSize: 18, color: c.primaryGreen},
  actionLabel: {marginTop: 4, fontSize: 12, color: c.titleBlack},
  reviewLink: {paddingHorizontal: 16, paddingBottom: 12},
  reviewText: {fontSize: 13, color: c.primaryGreen},
  footer: {padding: 16, paddingTop: 0},
  createBtn: {
    height: 48,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
