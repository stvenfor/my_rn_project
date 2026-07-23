import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RECHARGE_SERVICES,
  type RechargeService,
} from '../../data/rnLabRechargeMockData';

type Props = {
  visible: boolean;
  activeId: string;
  accent: string;
  onClose: () => void;
  onSelect: (service: RechargeService) => void;
};

export function RechargeSelectSheet({
  visible,
  activeId,
  accent,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(slide, {
          toValue: 1,
          friction: 9,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slide.setValue(0);
      fade.setValue(0);
    }
  }, [visible, fade, slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [420, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, {opacity: fade}]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{translateY}],
            },
          ]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>选择充值业务</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>关闭</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>点击后切换顶部服务并继续填写账号</Text>

          <View style={styles.grid}>
            {RECHARGE_SERVICES.map(item => {
              const active = item.id === activeId;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.cell,
                    active && {
                      borderColor: accent,
                      backgroundColor: `${accent}12`,
                    },
                  ]}
                  onPress={() => onSelect(item)}>
                  <View
                    style={[styles.iconWrap, {backgroundColor: item.iconBg}]}>
                    <Text style={styles.icon}>{item.iconGlyph}</Text>
                  </View>
                  <Text style={styles.cellTitle} numberOfLines={1}>
                    {item.tabLabel}
                  </Text>
                  <Text style={styles.cellDiscount}>{item.discount}</Text>
                  {active ? (
                    <View style={[styles.check, {backgroundColor: accent}]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[styles.confirm, {backgroundColor: accent}]}
            onPress={onClose}>
            <Text style={styles.confirmText}>完成选择</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  close: {
    fontSize: 14,
    color: '#8E8E93',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 12,
    color: '#8E8E93',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '31.5%',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  cellTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cellDiscount: {
    marginTop: 4,
    fontSize: 11,
    color: '#FF3B30',
    fontWeight: '600',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  confirm: {
    marginTop: 8,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
