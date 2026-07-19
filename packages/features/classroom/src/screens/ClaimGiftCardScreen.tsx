import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {classroomMockData} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

export function ClaimGiftCardScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.classroomClaimGift>) {
  const gift = classroomMockData.giftCard;

  return (
    <AppPageScaffold layout="standard" backgroundColor={c.noteBackground}>
      <AppNavBar
        title="领取礼品卡"
        showBackButton
        onBack={() => navigation.goBack()}
        backgroundColor={c.noteBackground}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.cardOuter}>
          <View style={styles.giftVisual}>
            <Text style={styles.giftType}>{gift.cardType}</Text>
            <Text style={styles.giftDuration}>{gift.duration}</Text>
            <Text style={styles.giftHint}>体验卡</Text>
          </View>
        </View>
        <View style={styles.note}>
          <Text style={styles.noteTo}>致 {gift.studentName}</Text>
          <Text style={styles.noteMsg}>{gift.message}</Text>
          <Text style={styles.noteFrom}>
            — {gift.teacherName} · {gift.date}
          </Text>
        </View>
        <Pressable
          style={styles.claimBtn}
          onPress={() => {
            AppToast.show('领取成功，可在背包中查看');
            navigation.goBack();
          }}>
          <Text style={styles.claimText}>立即领取</Text>
        </Pressable>
      </ScrollView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {padding: 16, paddingBottom: 32},
  cardOuter: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  giftVisual: {
    height: 180,
    borderRadius: 12,
    backgroundColor: c.giftCardBlue,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  giftType: {fontSize: 18, fontWeight: '700', color: '#fff'},
  giftDuration: {marginTop: 12, fontSize: 28, fontWeight: '800', color: '#fff'},
  giftHint: {marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  note: {
    marginTop: 24,
    padding: 20,
    borderRadius: d.cardRadius,
    backgroundColor: '#fff',
  },
  noteTo: {fontSize: 15, fontWeight: '600', color: c.titleBlack},
  noteMsg: {
    marginTop: 12,
    fontSize: 15,
    color: c.titleBlack,
    lineHeight: 24,
  },
  noteFrom: {
    marginTop: 16,
    fontSize: 13,
    color: c.textGray,
    textAlign: 'right',
  },
  claimBtn: {
    marginTop: 32,
    height: 48,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
