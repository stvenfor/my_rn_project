import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {
  AppDialogManager,
  AppNavBar,
  AppPageScaffold,
  AppToast,
} from '@ui/design-system';

type Props = RootStackScreenProps<typeof RoutePath.dialogDemo>;

function buildCustomNativeDialog({
  onClose,
}: {
  onClose: (result?: unknown) => void;
}) {
  return (
    <View style={styles.customCard}>
      <Text style={styles.customTitle}>原生 AlertDialog</Text>
      <Text style={styles.bodyText}>通过 showCustom 入队展示。</Text>
      <Pressable style={styles.customClose} onPress={() => onClose(undefined)}>
        <Text style={styles.customCloseText}>关闭</Text>
      </Pressable>
    </View>
  );
}

function buildPendingDemoDialog({
  onClose,
}: {
  onClose: (result?: unknown) => void;
}) {
  return (
    <View style={styles.customCard}>
      <Text style={styles.customTitle}>可被 cancelPending 取消</Text>
      <Text style={styles.bodyText}>tag = pending_demo</Text>
      <Pressable style={styles.customClose} onPress={() => onClose(undefined)}>
        <Text style={styles.customCloseText}>关闭</Text>
      </Pressable>
    </View>
  );
}

/** 1:1 with Flutter `DialogDemoPage` + `AppDialogManager`. */
export function DialogDemoScreen({navigation}: Props) {
  const [lastResult, setLastResult] = useState('—');
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => AppDialogManager.subscribe(bump), []);

  const run = useCallback(async (future: Promise<unknown>) => {
    const result = await future;
    setLastResult(result == null ? 'null' : String(result));
    bump();
  }, []);

  const snap = AppDialogManager.getSnapshot();

  return (
    <AppPageScaffold
      backgroundColor="#F2F2F7"
      navBar={
        <AppNavBar
          title="弹框示例"
          showBackButton
          backgroundColor="#FFFFFF"
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>调度状态</Text>
          <Text style={styles.statusLine}>
            正在展示：{snap.isShowing ? '是' : '否'}
          </Text>
          <Text style={styles.statusLine}>待展示数量：{snap.pendingCount}</Text>
          <Text style={styles.statusLine}>上次返回：{lastResult}</Text>
        </View>

        <Section title="样式示例">
          <DemoBtn
            label="单按钮提示（GeneralDialog）"
            onPress={() =>
              run(
                AppDialogManager.showAlert({
                  title: '温馨提示',
                  content: '这是单按钮提示弹框，点击确认后关闭。',
                }),
              )
            }
          />
          <DemoBtn
            label="双按钮确认（ConfirmDialog）"
            onPress={() =>
              run(
                AppDialogManager.showConfirm({
                  title: '确认操作',
                  content: '确定要执行此操作吗？',
                }),
              )
            }
          />
          <DemoBtn
            label="自定义内容（长文本滚动）"
            onPress={() =>
              run(
                AppDialogManager.showAlertWidget({
                  title: '活动规则',
                  content: (
                    <Text style={styles.bodyText}>
                      {Array.from({length: 8}, () => '规则条目示例内容。').join(
                        '\n',
                      )}
                    </Text>
                  ),
                  maxContentHeight: 220,
                }),
              )
            }
          />
          <DemoBtn
            label="无底部关闭按钮"
            onPress={() =>
              run(
                AppDialogManager.showAlert({
                  title: '系统通知',
                  content: '仅可通过确认按钮关闭。',
                  showCloseButton: false,
                }),
              )
            }
          />
          <DemoBtn
            label="点击遮罩可关闭"
            onPress={() =>
              run(
                AppDialogManager.showAlert({
                  title: '可点击遮罩关闭',
                  content: 'barrierDismissible = true',
                  barrierDismissible: true,
                }),
              )
            }
          />
          <DemoBtn
            label="完全自定义 Dialog"
            onPress={() =>
              run(
                AppDialogManager.showCustom({
                  builder: buildCustomNativeDialog,
                }),
              )
            }
          />
        </Section>

        <Section title="优先级调度">
          <DemoBtn
            label="同优先级 FIFO：连续入队 3 个中优"
            onPress={() => {
              for (let i = 1; i <= 3; i += 1) {
                AppDialogManager.showAlert({
                  title: `中优先级 · ${i}`,
                  content: `同档先进先出，第 ${i} 个`,
                  priority: 'medium',
                });
              }
              AppToast.show('已入队 3 个中优先级弹框');
              bump();
            }}
          />
          <DemoBtn
            label="先展示低优，再入队高优（不打断当前）"
            onPress={() => {
              AppDialogManager.showAlert({
                title: '低优先级',
                content:
                  '请先关闭本弹框。关闭后将优先展示已入队的高优先级弹框。',
                priority: 'low',
              });
              AppDialogManager.showAlert({
                title: '高优先级',
                content: '高优在队列中排在低优之前，但不会打断正在展示的弹框。',
                priority: 'high',
              });
              AppToast.show('已入队：低优（展示中）+ 高优（等待）');
              bump();
            }}
          />
          <DemoBtn
            label="高优连续入队 2 个（高内 FIFO，不替换）"
            onPress={() => {
              AppDialogManager.showAlert({
                title: '高优先级 · 1',
                content: '第一个高优弹框',
                priority: 'high',
              });
              AppDialogManager.showAlert({
                title: '高优先级 · 2',
                content: '第二个高优需等第一个关闭后再展示',
                priority: 'high',
              });
              AppToast.show('已入队 2 个高优先级弹框');
              bump();
            }}
          />
          <DemoBtn
            label="混合入队：低 → 中 → 高"
            onPress={() => {
              AppDialogManager.showAlert({
                title: '低',
                content: '优先级：低',
                priority: 'low',
              });
              AppDialogManager.showAlert({
                title: '中',
                content: '优先级：中',
                priority: 'medium',
              });
              AppDialogManager.showAlert({
                title: '高',
                content: '优先级：高（队列中排最前，但仍等当前关闭）',
                priority: 'high',
              });
              AppToast.show('展示顺序应为：当前 → 高 → 中 → 低');
              bump();
            }}
          />
        </Section>

        <Section title="队列管理">
          <DemoBtn
            label="入队带 tag 的弹框（tag: pending_demo）"
            onPress={() => {
              AppDialogManager.enqueue({
                tag: 'pending_demo',
                priority: 'low',
                builder: buildPendingDemoDialog,
              });
              AppToast.show('已入队 tag=pending_demo');
              bump();
            }}
          />
          <DemoBtn
            label='cancelPending("pending_demo")'
            onPress={() => {
              const ok = AppDialogManager.cancelPending('pending_demo');
              AppToast.show(ok ? '已取消' : '未找到待展示项');
              bump();
            }}
          />
          <DemoBtn
            label="clearPending() 清空待展示"
            onPress={() => {
              const n = AppDialogManager.clearPending();
              AppToast.show(`已清空 ${n} 个待展示弹框`);
              bump();
            }}
          />
        </Section>
      </ScrollView>
    </AppPageScaffold>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DemoBtn({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable
      style={({pressed}) => [styles.demoBtn, pressed && styles.demoBtnPressed]}
      onPress={onPress}>
      <Text style={styles.demoBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  statusLine: {
    fontSize: 14,
    color: '#333333',
    marginTop: 2,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  demoBtn: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  demoBtnPressed: {
    backgroundColor: 'rgba(0,122,255,0.06)',
  },
  demoBtnText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'left',
  },
  bodyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  customCard: {
    marginHorizontal: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  customTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  customClose: {
    marginTop: 16,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  customCloseText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
});
