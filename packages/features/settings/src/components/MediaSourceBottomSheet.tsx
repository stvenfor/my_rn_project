import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {mineTheme} from '../theme/mineTheme';
import {MineIcon, type MineIconName} from './mineIcons';

export type MediaPickSource = 'gallery' | 'camera';

interface Props {
  visible: boolean;
  onPick: (source: MediaPickSource) => void;
  onClose: () => void;
}

function OptionTile({
  label,
  icon,
  onPress,
  centered,
}: {
  label: string;
  icon?: MineIconName;
  onPress: () => void;
  centered?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon ? (
        <View style={styles.optionIconWrap}>
          <MineIcon name={icon} color={mineTheme.topIconColor} size={24} />
        </View>
      ) : null}
      <Text style={[styles.optionLabel, centered && styles.optionLabelCenter]}>
        {label}
      </Text>
      {icon ? <View style={styles.optionSpacer} /> : null}
    </TouchableOpacity>
  );
}

export function MediaSourceBottomSheet({visible, onPick, onClose}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.mask}>
        <Pressable style={styles.flexBackdrop} onPress={onClose} />
        <View
          style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 8)}]}>
          <View style={styles.handle} />
          <OptionTile
            label="相册"
            icon="photo_library_outlined"
            onPress={() => onPick('gallery')}
          />
          <View style={styles.divider} />
          <OptionTile
            label="相机"
            icon="camera_alt_outlined"
            onPress={() => onPick('camera')}
          />
          <View style={styles.sectionDivider} />
          <OptionTile label="取消" onPress={onClose} centered />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  flexBackdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionIconWrap: {
    width: 38,
    alignItems: 'flex-start',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: mineTheme.titleBlack,
  },
  optionLabelCenter: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#666666',
  },
  optionSpacer: {
    width: 38,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
});
