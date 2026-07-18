import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {classroomMockData} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

export function HomeworkReviewScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.classroomHomeworkReview>) {
  const [selected, setSelected] = useState<string[]>([
    classroomMockData.reviewStudents[0]!,
  ]);
  const [feedback, setFeedback] = useState('');
  const [sendGift, setSendGift] = useState(false);

  const toggleStudent = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );
  };

  const onSend = () => {
    AppToast.show('点评已发送');
    if (sendGift) {
      AppToast.show('已赠送 SVIP 体验卡');
    }
    navigation.goBack();
  };

  return (
    <AppPageScaffold layout="standard" backgroundColor={c.background}>
      <AppNavBar
        title="作业点评"
        onBack={() => navigation.goBack()}
        backgroundColor={c.background}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>点评学生</Text>
          <View style={styles.tags}>
            {classroomMockData.reviewStudents.map(name => {
              const active = selected.includes(name);
              return (
                <Pressable
                  key={name}
                  onPress={() => toggleStudent(name)}
                  style={[styles.tag, active && styles.tagActive]}>
                  <Text
                    style={[styles.tagText, active && styles.tagTextActive]}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>点评内容</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="请输入点评"
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
        <Pressable style={styles.giftRow} onPress={() => setSendGift(v => !v)}>
          <Text style={styles.giftCheck}>{sendGift ? '☑' : '☐'}</Text>
          <Text style={styles.giftText}>同时赠送 SVIP 体验卡</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.sendBtn} onPress={onSend}>
          <Text style={styles.sendText}>发送</Text>
        </Pressable>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {padding: 16, paddingBottom: 24},
  card: {
    backgroundColor: c.cardWhite,
    borderRadius: d.cardRadius,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: c.titleBlack,
    marginBottom: 8,
  },
  tags: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },
  tagActive: {backgroundColor: 'rgba(82,196,26,0.15)'},
  tagText: {fontSize: 13, color: c.textGray},
  tagTextActive: {color: c.primaryGreen, fontWeight: '600'},
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: c.titleBlack,
  },
  giftRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8},
  giftCheck: {fontSize: 18, color: c.primaryGreen},
  giftText: {marginLeft: 8, fontSize: 14, color: c.titleBlack},
  footer: {padding: 16},
  sendBtn: {
    height: 48,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
