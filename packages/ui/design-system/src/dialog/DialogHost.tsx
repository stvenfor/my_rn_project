import React, {useEffect, useReducer} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {AppDialogManager} from './appDialogManager';

/** Renders the active queued dialog (Flutter Get.overlayContext equivalent). */
export function DialogHost() {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => AppDialogManager.subscribe(bump), []);

  const {current} = AppDialogManager.getSnapshot();
  if (!current) {
    return null;
  }

  const dismiss = (result?: unknown) => {
    AppDialogManager.dismissCurrent(result);
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={() => {
        if (current.barrierDismissible) {
          dismiss(undefined);
        }
      }}>
      <View style={styles.mask}>
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            if (current.barrierDismissible) {
              dismiss(undefined);
            }
          }}
        />
        <View style={styles.center} pointerEvents="box-none">
          {current.builder({onClose: dismiss})}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    zIndex: 1,
    elevation: 8,
  },
});
