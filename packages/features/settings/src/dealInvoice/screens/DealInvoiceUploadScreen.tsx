import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  DEAL_INVOICE_CUSTOMERS,
  INVOICE_PREVIEW_URL,
  auditColor,
  auditLabel,
  customerDisplay,
  formatDealInvoiceDateTime,
  type DealInvoiceCustomer,
  type DealInvoiceItem,
  type DealInvoiceStatus,
  type DealInvoiceUploadPhase,
  type DealInvoiceUploadScene,
} from '../models/dealInvoiceModels';

type Props = RootStackScreenProps<typeof RoutePath.dealInvoiceUpload>;

const BG = '#F5F6F8';
const ACCENT = '#3B8CFF';

/** Aligns with Flutter `DealInvoiceUploadPage` + ViewModel. */
export function DealInvoiceUploadScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const scene: DealInvoiceUploadScene = route.params?.scene ?? 'create';
  const item = route.params?.item as DealInvoiceItem | undefined;

  const initial = useMemo(() => initFromScene(scene, item), [scene, item]);

  const [phase, setPhase] = useState<DealInvoiceUploadPhase>(initial.phase);
  const [selectedCustomer, setSelectedCustomer] =
    useState<DealInvoiceCustomer | null>(initial.customer);
  const [hasInvoiceImage, setHasInvoiceImage] = useState(initial.hasImage);
  const [auditStatus, setAuditStatus] = useState<DealInvoiceStatus>(
    initial.status,
  );
  const [submittedAt, setSubmittedAt] = useState<string | null>(
    initial.submittedAt,
  );
  const [rejectReason, setRejectReason] = useState<string | null>(
    initial.rejectReason,
  );
  const [ratingStars, setRatingStars] = useState<number | null>(
    initial.ratingStars,
  );
  const [imageReplaced, setImageReplaced] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const isEditing = phase === 'editing';
  const isUploading = phase === 'uploading';
  const isDetail = phase === 'detail';

  const showSubmitButton = isDetail ? auditStatus === 'rejected' : true;

  const canSubmit = (() => {
    if (isUploading) {
      return false;
    }
    if (isDetail && auditStatus === 'rejected') {
      return imageReplaced;
    }
    if (isEditing) {
      return selectedCustomer != null && hasInvoiceImage;
    }
    return false;
  })();

  const showCustomerPicker = isEditing && !isUploading;
  const showPendingPlaceholder = isDetail && auditStatus === 'pendingReview';
  const showApprovedStamp =
    isDetail &&
    (auditStatus === 'approvedPendingRating' || auditStatus === 'rated');
  const showReuploadOverlay =
    !(isEditing && hasInvoiceImage) &&
    isDetail &&
    auditStatus === 'rejected' &&
    !imageReplaced;
  const showRating = isDetail && auditStatus === 'rated';

  const pickInvoiceImage = useCallback(async () => {
    if (isUploading) {
      return;
    }
    await delay(300);
    setHasInvoiceImage(true);
    if (isDetail && auditStatus === 'rejected') {
      setImageReplaced(true);
    }
  }, [auditStatus, isDetail, isUploading]);

  const submit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }
    setPhase('uploading');
    await delay(900);
    setPhase('detail');
    setAuditStatus('pendingReview');
    setSubmittedAt(new Date().toISOString());
    setRejectReason(null);
    setRatingStars(null);
    AppToast.show('已提交审核');
  }, [canSubmit]);

  return (
    <AppPageScaffold
      backgroundColor={BG}
      navBar={
        <AppNavBar
          title="上传发票"
          showBackButton
          backgroundColor="#FFFFFF"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          {showCustomerPicker ? (
            <>
              <Pressable
                style={styles.customerRow}
                onPress={() => setPickerVisible(true)}>
                <Text style={styles.customerLabel}>购车客户</Text>
                <Text
                  style={[
                    styles.customerValue,
                    !selectedCustomer && styles.customerPlaceholder,
                  ]}>
                  {selectedCustomer
                    ? customerDisplay(selectedCustomer)
                    : '选择客户'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
              <Text style={styles.sectionTitle}>新车发票</Text>
            </>
          ) : null}

          <ImageArea
            hasImage={hasInvoiceImage}
            uploading={isUploading}
            isEditing={isEditing}
            showPending={showPendingPlaceholder}
            showStamp={showApprovedStamp}
            showReupload={showReuploadOverlay}
            onPick={pickInvoiceImage}
            onClear={() => setHasInvoiceImage(false)}
          />

          {isDetail || selectedCustomer ? (
            <View style={styles.infoCard}>
              {selectedCustomer ? (
                <InfoRow
                  label="购车客户"
                  value={customerDisplay(selectedCustomer)}
                />
              ) : null}
              {isDetail ? (
                <InfoRow
                  label="提交时间"
                  value={formatDealInvoiceDateTime(submittedAt)}
                />
              ) : null}
              {isDetail ? (
                <InfoRow
                  label="审核状态"
                  value={auditLabel(auditStatus)}
                  valueColor={auditColor(auditStatus)}
                />
              ) : null}
              {isDetail && auditStatus === 'rejected' && rejectReason ? (
                <InfoRow
                  label="未通过原因"
                  value={rejectReason}
                  valueColor="#E53935"
                />
              ) : null}
              {showRating ? (
                <InfoRow
                  label="客户评价"
                  trailing={<StarRating stars={ratingStars ?? 0} />}
                />
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        {showSubmitButton ? (
          <View
            style={[
              styles.submitBar,
              {paddingBottom: Math.max(insets.bottom, 12)},
            ]}>
            <Pressable
              style={[
                styles.submitBtn,
                (!canSubmit || isUploading) && styles.submitDisabled,
              ]}
              disabled={!canSubmit || isUploading}
              onPress={() => {
                submit().catch(() => undefined);
              }}>
              {isUploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>提交审核</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </View>

      <Modal
        transparent
        visible={pickerVisible}
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}>
        <Pressable
          style={styles.sheetMask}
          onPress={() => setPickerVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>选择购车客户</Text>
            {DEAL_INVOICE_CUSTOMERS.map(customer => (
              <Pressable
                key={customer.phone}
                style={styles.sheetOption}
                onPress={() => {
                  setSelectedCustomer(customer);
                  setPickerVisible(false);
                }}>
                <Text style={styles.sheetOptionText}>
                  {customerDisplay(customer)}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </AppPageScaffold>
  );
}

function initFromScene(
  scene: DealInvoiceUploadScene,
  item?: DealInvoiceItem,
) {
  if (scene === 'detail' && item) {
    return {
      phase: 'detail' as const,
      hasImage: item.status !== 'pendingReview',
      status: item.status,
      submittedAt: item.submittedAt,
      rejectReason: item.rejectReason ?? null,
      ratingStars: item.ratingStars ?? null,
      customer: {
        phone: item.phone,
        name: item.customerName ?? '',
      },
    };
  }
  if (scene === 'reupload' && item) {
    return {
      phase: 'editing' as const,
      hasImage: false,
      status: 'rejected' as const,
      submittedAt: item.submittedAt,
      rejectReason: item.rejectReason ?? null,
      ratingStars: null,
      customer: {
        phone: item.phone,
        name: item.customerName ?? '',
      },
    };
  }
  return {
    phase: 'editing' as const,
    hasImage: false,
    status: 'pendingReview' as const,
    submittedAt: null,
    rejectReason: null,
    ratingStars: null,
    customer: null,
  };
}

function ImageArea({
  hasImage,
  uploading,
  isEditing,
  showPending,
  showStamp,
  showReupload,
  onPick,
  onClear,
}: {
  hasImage: boolean;
  uploading: boolean;
  isEditing: boolean;
  showPending: boolean;
  showStamp: boolean;
  showReupload: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  if (!hasImage && isEditing) {
    return (
      <Pressable style={styles.dashBox} disabled={uploading} onPress={onPick}>
        {uploading ? (
          <ActivityIndicator color={ACCENT} />
        ) : (
          <>
            <View style={styles.addCircle}>
              <Text style={styles.addPlus}>＋</Text>
            </View>
            <Text style={styles.uploadTitle}>上传发票</Text>
            <Text style={styles.uploadHint}>
              请保证发票清晰可识别、避免模糊和遮挡
            </Text>
          </>
        )}
      </Pressable>
    );
  }

  if (showPending) {
    return (
      <View style={styles.pendingBox}>
        <Text style={styles.pendingIcon}>⬆</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={styles.previewWrap}
      onPress={
        showReupload || isEditing
          ? () => {
              onPick();
            }
          : undefined
      }>
      <Image source={{uri: INVOICE_PREVIEW_URL}} style={styles.preview} />
      {uploading ? (
        <View style={styles.previewMask}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : null}
      {showStamp ? (
        <View style={styles.stamp}>
          <Text style={styles.stampText}>{'审核\n通过'}</Text>
        </View>
      ) : null}
      {showReupload ? (
        <View style={styles.reuploadBar}>
          <Text style={styles.reuploadText}>↻ 重新上传</Text>
        </View>
      ) : null}
      {isEditing && hasImage && !uploading ? (
        <Pressable style={styles.clearBtn} onPress={onClear}>
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  trailing,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueWrap}>
        {trailing ?? (
          <Text
            style={[styles.infoValue, valueColor ? {color: valueColor} : null]}>
            {value ?? ''}
          </Text>
        )}
      </View>
    </View>
  );
}

function StarRating({stars}: {stars: number}) {
  return (
    <View style={styles.stars}>
      {Array.from({length: 5}, (_, i) => (
        <Text
          key={i}
          style={[styles.star, i < stars ? styles.starOn : styles.starOff]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  customerRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerLabel: {fontSize: 15, color: '#1A1A1A'},
  customerValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    color: '#666666',
    marginLeft: 12,
  },
  customerPlaceholder: {color: '#9E9E9E'},
  chevron: {fontSize: 18, color: '#BDBDBD', marginLeft: 4},
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  dashBox: {
    borderWidth: 1.5,
    borderColor: '#B8C9F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 36,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlus: {color: '#FFFFFF', fontSize: 32, marginTop: -2},
  uploadTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  uploadHint: {
    marginTop: 8,
    paddingHorizontal: 24,
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 17,
  },
  pendingBox: {
    aspectRatio: 1.45,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingIcon: {fontSize: 48, color: '#BDBDBD'},
  previewWrap: {
    aspectRatio: 1.45,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  preview: {width: '100%', height: '100%'},
  previewMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stamp: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    color: '#E53935',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  reuploadBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
  },
  reuploadText: {color: '#FFFFFF', fontSize: 15, fontWeight: '500'},
  clearBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.54)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {color: '#FFFFFF', fontSize: 18, marginTop: -1},
  infoCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  infoLabel: {width: 88, fontSize: 15, color: '#1A1A1A'},
  infoValueWrap: {flex: 1},
  infoValue: {fontSize: 15, color: '#666666', lineHeight: 22},
  stars: {flexDirection: 'row'},
  star: {fontSize: 20, marginRight: 2},
  starOn: {color: '#FAAD14'},
  starOff: {color: '#E0E0E0'},
  submitBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  submitBtn: {
    height: 48,
    borderRadius: 8,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {backgroundColor: '#E0E0E0'},
  submitText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  sheetMask: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
  },
  sheetTitle: {
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sheetOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sheetOptionText: {fontSize: 15, color: '#1A1A1A'},
});
