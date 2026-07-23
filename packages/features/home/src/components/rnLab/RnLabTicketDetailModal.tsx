import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  RN_LAB_PRIORITIES,
  RN_LAB_STATUS_TABS,
  formatRnLabAmount,
  type RnLabTicket,
  type RnLabTicketPriority,
  type RnLabTicketStatus,
} from '../../data/rnLabLayoutMockData';
import {homeDashboardTheme as t} from '../../theme/homeDashboardTheme';

interface Props {
  visible: boolean;
  ticket: RnLabTicket | null;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: {
    status: RnLabTicketStatus;
    priority: RnLabTicketPriority;
    note: string;
  }) => Promise<unknown>;
}

export function RnLabTicketDetailModal({
  visible,
  ticket,
  saving,
  onClose,
  onSave,
}: Props) {
  const [status, setStatus] = useState<RnLabTicketStatus>('pending');
  const [priority, setPriority] = useState<RnLabTicketPriority>('P2');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticket) {
      return;
    }
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setNote(ticket.note);
    setError(null);
  }, [ticket]);

  const submit = async () => {
    if (!ticket) {
      return;
    }
    if (status === 'blocked' && note.trim().length < 4) {
      setError('阻塞状态必须填写至少 4 字原因');
      return;
    }
    if (status === 'done' && ticket.progress < 80 && note.trim().length < 2) {
      setError('未达 80% 进度结案时需补充结案说明');
      return;
    }
    setError(null);
    await onSave({status, priority, note: note.trim()});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismiss} onPress={onClose} />
        <View style={styles.sheet}>
          {ticket ? (
            <>
              <Text style={styles.title}>{ticket.title}</Text>
              <Text style={styles.sub}>
                {ticket.id} · {ticket.customer} · {formatRnLabAmount(ticket.amount)}
              </Text>

              <Text style={styles.label}>状态</Text>
              <View style={styles.row}>
                {RN_LAB_STATUS_TABS.filter(item => item.key !== 'all').map(
                  item => {
                    const key = item.key as RnLabTicketStatus;
                    const active = status === key;
                    return (
                      <Pressable
                        key={key}
                        style={[styles.chip, active && styles.chipOn]}
                        onPress={() => setStatus(key)}>
                        <Text
                          style={[styles.chipText, active && styles.chipTextOn]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>

              <Text style={styles.label}>优先级</Text>
              <View style={styles.row}>
                {RN_LAB_PRIORITIES.map(item => {
                  const active = priority === item;
                  return (
                    <Pressable
                      key={item}
                      style={[styles.chip, active && styles.chipOn]}
                      onPress={() => setPriority(item)}>
                      <Text
                        style={[styles.chipText, active && styles.chipTextOn]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>备注</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="填写阻塞原因 / 结案说明"
                placeholderTextColor={t.labelTertiary}
                multiline
                style={styles.input}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.actions}>
                <Pressable style={styles.cancel} onPress={onClose}>
                  <Text style={styles.cancelText}>取消</Text>
                </Pressable>
                <Pressable
                  style={[styles.save, saving && styles.saveDisabled]}
                  disabled={saving}
                  onPress={submit}>
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>保存变更</Text>
                  )}
                </Pressable>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  dismiss: {
    flex: 1,
  },
  sheet: {
    backgroundColor: t.cardWhite,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: t.titleBlack,
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: t.textGray,
    marginBottom: 14,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: t.textDarkGray,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: t.fillSecondary,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: {
    backgroundColor: t.primaryBlue,
  },
  chipText: {
    fontSize: 12,
    color: t.textDarkGray,
  },
  chipTextOn: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    minHeight: 84,
    borderRadius: 10,
    padding: 12,
    backgroundColor: t.background,
    color: t.titleBlack,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  error: {
    marginTop: 8,
    color: '#FF3B30',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancel: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.fillSecondary,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: t.textDarkGray,
  },
  save: {
    flex: 1.2,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.primaryBlue,
  },
  saveDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
