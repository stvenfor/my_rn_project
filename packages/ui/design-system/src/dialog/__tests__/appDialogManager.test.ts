import {AppDialogManager} from '../appDialogManager';

describe('AppDialogManager', () => {
  beforeEach(() => {
    AppDialogManager.clearPending();
    if (AppDialogManager.isShowing) {
      AppDialogManager.dismissCurrent(null);
    }
  });

  it('shows one dialog and reports pending for subsequent entries', () => {
    const first = AppDialogManager.showAlert({
      title: 'A',
      content: 'a',
      priority: 'low',
    });
    expect(AppDialogManager.isShowing).toBe(true);
    expect(AppDialogManager.pendingCount).toBe(0);

    AppDialogManager.showAlert({
      title: 'B',
      content: 'b',
      priority: 'high',
    });
    expect(AppDialogManager.pendingCount).toBe(1);

    AppDialogManager.dismissCurrent('done');
    expect(AppDialogManager.isShowing).toBe(true);
    expect(AppDialogManager.getSnapshot().current?.priority).toBe('high');

    AppDialogManager.dismissCurrent(undefined);
    return expect(first).resolves.toBe('done');
  });

  it('sorts pending by priority then FIFO', () => {
    AppDialogManager.showAlert({title: 'cur', content: 'c'});
    AppDialogManager.showAlert({
      title: 'low',
      content: 'l',
      priority: 'low',
    });
    AppDialogManager.showAlert({
      title: 'high',
      content: 'h',
      priority: 'high',
    });
    AppDialogManager.showAlert({
      title: 'mid',
      content: 'm',
      priority: 'medium',
    });

    AppDialogManager.dismissCurrent(undefined);
    expect(AppDialogManager.getSnapshot().current?.builder).toBeTruthy();
    // high next
    expect(
      (AppDialogManager.getSnapshot().current as {priority: string}).priority,
    ).toBe('high');
    AppDialogManager.dismissCurrent(undefined);
    expect(AppDialogManager.getSnapshot().current?.priority).toBe('medium');
    AppDialogManager.dismissCurrent(undefined);
    expect(AppDialogManager.getSnapshot().current?.priority).toBe('low');
    AppDialogManager.dismissCurrent(undefined);
  });

  it('cancelPending removes tagged entry', () => {
    AppDialogManager.showAlert({title: 'cur', content: 'c'});
    AppDialogManager.enqueue({
      tag: 'pending_demo',
      priority: 'low',
      builder: ({onClose}) => {
        onClose(undefined);
        return null;
      },
    });
    expect(AppDialogManager.pendingCount).toBe(1);
    expect(AppDialogManager.cancelPending('pending_demo')).toBe(true);
    expect(AppDialogManager.pendingCount).toBe(0);
    expect(AppDialogManager.cancelPending('pending_demo')).toBe(false);
    AppDialogManager.dismissCurrent(undefined);
  });

  it('clearPending empties queue only', () => {
    AppDialogManager.showAlert({title: 'cur', content: 'c'});
    AppDialogManager.showAlert({title: 'p1', content: 'p'});
    AppDialogManager.showAlert({title: 'p2', content: 'p'});
    expect(AppDialogManager.clearPending()).toBe(2);
    expect(AppDialogManager.pendingCount).toBe(0);
    expect(AppDialogManager.isShowing).toBe(true);
    AppDialogManager.dismissCurrent(undefined);
  });
});
