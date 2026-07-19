import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
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
  testID,
}: {
  label: string;
  icon?: MineIconName;
  onPress: () => void;
  centered?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      style={({pressed}) => [styles.option, pressed && styles.optionPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      {icon ? (
        <View style={styles.optionIconWrap}>
          <MineIcon name={icon} color={mineTheme.topIconColor} size={24} />
        </View>
      ) : null}
      <Text style={[styles.optionLabel, centered && styles.optionLabelCenter]}>
        {label}
      </Text>
      {icon ? <View style={styles.optionSpacer} /> : null}
    </Pressable>
  );
}

/**
 * Aligns with Flutter `MediaSourceBottomSheet` (Get.bottomSheet).
 * Backdrop uses absoluteFill so it cannot steal touches from the sheet
 * (flex:1 Pressable + justifyContent flex-end breaks cancel on Harmony).
 */
export function MediaSourceBottomSheet({visible, onPick, onClose}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.mask} pointerEvents="box-none">
        <Pressable
          testID="media-source-backdrop"
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="关闭"
        />
        <View
          style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 8)}]}
          pointerEvents="auto">
          <View style={styles.handle} />
          <OptionTile
            testID="media-source-gallery"
            label="相册"
            icon="photo_library_outlined"
            onPress={() => onPick('gallery')}
          />
          <View style={styles.divider} />
          <OptionTile
            testID="media-source-camera"
            label="相机"
            icon="camera_alt_outlined"
            onPress={() => onPick('camera')}
          />
          <View style={styles.sectionDivider} />
          <OptionTile
            testID="media-source-cancel"
            label="取消"
            onPress={onClose}
            centered
          />
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 8,
    zIndex: 1,
    elevation: 8,
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
  optionPressed: {
    backgroundColor: '#F7F7F7',
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
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
});
