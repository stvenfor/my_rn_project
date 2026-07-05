import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {MineProfileModel} from '../models/mineProfileModel';
import {mineStores} from '../models/mineStoreData';
import {mineTheme} from '../theme/mineTheme';
import {MineIcon, type MineIconName} from './mineIcons';
import {MineStatsBar} from './MineStatsBar';

interface TopIconProps {
  icon: MineIconName;
  onPress: () => void;
}

function TopIcon({icon, onPress}: TopIconProps) {
  return (
    <TouchableOpacity style={styles.topIcon} onPress={onPress} hitSlop={8}>
      <MineIcon name={icon} color={mineTheme.topIconColor} size={22} />
    </TouchableOpacity>
  );
}

function RoleBadge({label}: {label: string}) {
  return (
    <View style={styles.roleBadge}>
      <MineIcon name="verified" color="#fff" size={12} />
      <Text style={styles.roleBadgeText}>{label}</Text>
    </View>
  );
}

function Avatar({url}: {url: string | null}) {
  const content =
    url && url.length > 0 ? (
      <Image source={{uri: url}} style={styles.avatarImage} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <MineIcon name="person" color="#fff" size={36} />
      </View>
    );

  return <View style={styles.avatarShell}>{content}</View>;
}

interface Props {
  data: MineProfileModel;
  showBackButton: boolean;
  isLoggedIn: boolean;
  onBack?: () => void;
  onInfoTap: () => void;
  onCalendarTap: () => void;
  onSettingsTap: () => void;
  onAuthTap: () => void;
  onStoreTap: () => void;
  onElectronicCardTap: () => void;
  onAvatarTap: () => void;
}

export function MineHeader({
  data,
  showBackButton,
  isLoggedIn,
  onBack,
  onInfoTap,
  onCalendarTap,
  onSettingsTap,
  onAuthTap,
  onStoreTap,
  onElectronicCardTap,
  onAvatarTap,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.gradient}>
        <View style={styles.gradientTop} />
        <View style={[styles.decorativeCircle, {top: insets.top + 20}]} />
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + 8,
              paddingBottom: 72,
            },
          ]}>
          <View style={styles.topBar}>
            {showBackButton ? (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <MineIcon
                  name="arrow_back_ios_new"
                  color={mineTheme.topIconColor}
                  size={20}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.backSpacer} />
            )}
            <View style={styles.topActions}>
              <TopIcon icon="info_outline" onPress={onInfoTap} />
              <TopIcon icon="event_available_outlined" onPress={onCalendarTap} />
              <TopIcon icon="settings_outlined" onPress={onSettingsTap} />
              <TopIcon
                icon={isLoggedIn ? 'logout_rounded' : 'login_rounded'}
                onPress={onAuthTap}
              />
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.profileText}>
              <View style={styles.nameRow}>
                <Text style={styles.displayName} numberOfLines={1}>
                  {data.displayName}
                </Text>
                <RoleBadge label={data.roleBadge} />
              </View>
              <Pressable style={styles.storeRow} onPress={onStoreTap}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {data.storeName}
                </Text>
                <View style={styles.storeArrowWrap}>
                  <MineIcon
                    name="keyboard_arrow_down"
                    color={mineTheme.textGray600}
                    size={18}
                  />
                </View>
              </Pressable>
              <View style={styles.metaRow}>
                <Pressable
                  style={styles.eCardRow}
                  onPress={onElectronicCardTap}>
                  <MineIcon
                    name="badge_outlined"
                    color={mineTheme.textGray600}
                    size={16}
                  />
                  <Text style={styles.eCardText}>电子名片</Text>
                </Pressable>
                <Text style={styles.phoneText}>{data.maskedPhone}</Text>
              </View>
            </View>
            <Pressable onPress={onAvatarTap}>
              <Avatar url={data.avatarUrl} />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.statsWrap}>
        <MineStatsBar stats={data.stats} />
      </View>
    </View>
  );
}

interface SwitchStoreDialogProps {
  visible: boolean;
  selectedId: string;
  onSelect: (storeId: string) => void;
  onClose: () => void;
}

export function SwitchStoreDialog({
  visible,
  selectedId,
  onSelect,
  onClose,
}: SwitchStoreDialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.dialogMask} onPress={onClose}>
        <Pressable style={styles.dialogStack} onPress={() => {}}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>切换店铺</Text>
            <Text style={styles.dialogSubtitle}>可切换多个店铺查看数据</Text>
            {mineStores.map((store, index) => {
              const selected = store.id === selectedId;
              return (
                <View key={store.id}>
                  <Pressable
                    style={[
                      styles.storeOption,
                      index === 0 && styles.storeOptionFirst,
                      selected && styles.storeOptionSelected,
                    ]}
                    onPress={() => onSelect(store.id)}>
                    <Text
                      style={[
                        styles.storeOptionText,
                        selected && styles.storeOptionTextSelected,
                      ]}
                      numberOfLines={1}>
                      {store.name}
                    </Text>
                  </Pressable>
                  {index < mineStores.length - 1 ? (
                    <View style={styles.storeGap} />
                  ) : null}
                </View>
              );
            })}
          </View>
          <TouchableOpacity style={styles.dialogClose} onPress={onClose}>
            <MineIcon name="close" color="#fff" size={18} />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  gradient: {
    backgroundColor: mineTheme.headerGradientEnd,
    overflow: 'hidden',
  },
  gradientTop: {
    ...StyleSheet.absoluteFillObject,
    height: '55%',
    backgroundColor: mineTheme.headerGradientStart,
    opacity: 0.85,
  },
  decorativeCircle: {
    position: 'absolute',
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  content: {
    paddingHorizontal: 16,
  },
  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 8,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    flexShrink: 1,
    fontSize: 22,
    fontWeight: '700',
    color: mineTheme.titleBlack,
  },
  roleBadge: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: mineTheme.roleBadgeBlue,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  storeRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    flexShrink: 1,
    fontSize: 13,
    color: mineTheme.textGray700,
  },
  storeArrowWrap: {
    marginLeft: 2,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  eCardText: {
    fontSize: 13,
    color: mineTheme.textGray700,
  },
  phoneText: {
    fontSize: 13,
    color: mineTheme.textGray700,
  },
  avatarShell: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: mineTheme.avatarPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: -28,
  },
  dialogMask: {
    flex: 1,
    backgroundColor: mineTheme.dialogMask,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  dialogStack: {
    width: '100%',
    alignItems: 'center',
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: mineTheme.titleBlack,
    textAlign: 'center',
  },
  dialogSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: mineTheme.dialogSubtitle,
    textAlign: 'center',
  },
  storeGap: {
    height: 12,
  },
  storeOption: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: mineTheme.borderGray,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  storeOptionFirst: {
    marginTop: 20,
  },
  storeOptionSelected: {
    borderColor: mineTheme.primaryBlue,
  },
  storeOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: mineTheme.titleBlack,
  },
  storeOptionTextSelected: {
    color: mineTheme.primaryBlue,
  },
  dialogClose: {
    marginTop: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
