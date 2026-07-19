import React from 'react';
import {ConfirmDialog} from './ConfirmDialog';
import {GeneralDialog} from './GeneralDialog';
import {DIALOG_PRIORITY_WEIGHT, type DialogPriority} from './dialogPriority';

export type DialogCloseHandler = (result?: unknown) => void;

export type DialogBuilder = (helpers: {
  onClose: DialogCloseHandler;
}) => React.ReactNode;

interface DialogEntry {
  id: string;
  priority: DialogPriority;
  sequence: number;
  barrierDismissible: boolean;
  builder: DialogBuilder;
  resolve: (value: unknown) => void;
}

export interface DialogManagerSnapshot {
  isShowing: boolean;
  pendingCount: number;
  current: DialogEntry | null;
}

type Listener = () => void;

/**
 * Aligns with Flutter `AppDialogManager`:
 * mutual exclusion, priority + same-tier FIFO queue.
 */
class AppDialogManagerImpl {
  private readonly queue: DialogEntry[] = [];
  private current: DialogEntry | null = null;
  private sequence = 0;
  private pumping = false;
  private readonly listeners = new Set<Listener>();

  get isShowing(): boolean {
    return this.current != null;
  }

  get pendingCount(): number {
    return this.queue.length;
  }

  getSnapshot(): DialogManagerSnapshot {
    return {
      isShowing: this.isShowing,
      pendingCount: this.pendingCount,
      current: this.current,
    };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    this.listeners.forEach(listener => listener());
  }

  showAlert(options: {
    title: string;
    content: string;
    priority?: DialogPriority;
    confirmText?: string;
    showCloseButton?: boolean;
    barrierDismissible?: boolean;
    onConfirm?: () => void;
  }): Promise<unknown> {
    const {
      title,
      content,
      priority = 'medium',
      confirmText,
      showCloseButton = true,
      barrierDismissible = false,
      onConfirm,
    } = options;
    return this.enqueue({
      priority,
      barrierDismissible,
      builder: ({onClose}) =>
        React.createElement(GeneralDialog, {
          title,
          content,
          confirmText,
          showCloseButton,
          onConfirm,
          onClose,
        }),
    });
  }

  showAlertWidget(options: {
    title: string;
    content: React.ReactNode;
    priority?: DialogPriority;
    confirmText?: string;
    showCloseButton?: boolean;
    barrierDismissible?: boolean;
    onConfirm?: () => void;
    maxContentHeight?: number;
  }): Promise<unknown> {
    const {
      title,
      content,
      priority = 'medium',
      confirmText,
      showCloseButton = true,
      barrierDismissible = false,
      onConfirm,
      maxContentHeight,
    } = options;
    return this.enqueue({
      priority,
      barrierDismissible,
      builder: ({onClose}) =>
        React.createElement(GeneralDialog, {
          title,
          content,
          confirmText,
          showCloseButton,
          maxContentHeight,
          onConfirm,
          onClose,
        }),
    });
  }

  showConfirm(options: {
    title: string;
    content: string;
    priority?: DialogPriority;
    confirmText?: string;
    cancelText?: string;
    showCloseButton?: boolean;
    barrierDismissible?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }): Promise<boolean | null | undefined> {
    const {
      title,
      content,
      priority = 'medium',
      confirmText,
      cancelText,
      showCloseButton = true,
      barrierDismissible = false,
      onConfirm,
      onCancel,
    } = options;
    return this.enqueue({
      priority,
      barrierDismissible,
      builder: ({onClose}) =>
        React.createElement(ConfirmDialog, {
          title,
          content,
          confirmText,
          cancelText,
          showCloseButton,
          onConfirm,
          onCancel,
          onClose: result => onClose(result),
        }),
    }) as Promise<boolean | null | undefined>;
  }

  showCustom<T = unknown>(options: {
    builder: DialogBuilder;
    priority?: DialogPriority;
    barrierDismissible?: boolean;
  }): Promise<T | null | undefined> {
    const {builder, priority = 'medium', barrierDismissible = true} = options;
    return this.enqueue({
      priority,
      barrierDismissible,
      builder,
    }) as Promise<T | null | undefined>;
  }

  enqueue<T = unknown>(options: {
    builder: DialogBuilder;
    priority?: DialogPriority;
    barrierDismissible?: boolean;
    tag?: string;
  }): Promise<T | null | undefined> {
    const {
      builder,
      priority = 'medium',
      barrierDismissible = false,
      tag,
    } = options;

    return new Promise<T | null | undefined>(resolve => {
      const entry: DialogEntry = {
        id: tag ?? `dialog_${this.sequence + 1}`,
        priority,
        sequence: ++this.sequence,
        barrierDismissible,
        builder,
        resolve: value => resolve(value as T | null | undefined),
      };
      this.queue.push(entry);
      this.sortQueue();
      this.emit();
      this.pump();
    });
  }

  /** Clear pending queue (does not dismiss the currently shown dialog). */
  clearPending(): number {
    const removed = this.queue.length;
    this.queue.forEach(entry => entry.resolve(null));
    this.queue.length = 0;
    this.emit();
    return removed;
  }

  cancelPending(tag: string): boolean {
    const index = this.queue.findIndex(entry => entry.id === tag);
    if (index < 0) {
      return false;
    }
    const [entry] = this.queue.splice(index, 1);
    entry.resolve(null);
    this.emit();
    return true;
  }

  /** Called by DialogHost when the active dialog closes. */
  dismissCurrent(result?: unknown): void {
    if (!this.current) {
      return;
    }
    const entry = this.current;
    this.current = null;
    this.pumping = false;
    entry.resolve(result);
    this.emit();
    this.pump();
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      const byPriority =
        DIALOG_PRIORITY_WEIGHT[a.priority] - DIALOG_PRIORITY_WEIGHT[b.priority];
      if (byPriority !== 0) {
        return byPriority;
      }
      return a.sequence - b.sequence;
    });
  }

  private pump(): void {
    if (this.pumping || this.current != null) {
      return;
    }
    if (this.queue.length === 0) {
      return;
    }
    this.pumping = true;
    this.current = this.queue.shift() ?? null;
    this.emit();
  }
}

export const AppDialogManager = new AppDialogManagerImpl();
