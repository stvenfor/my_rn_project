/** Aligns with Flutter `DialogPriority` — lower weight = higher priority. */
export type DialogPriority = 'high' | 'medium' | 'low';

export const DIALOG_PRIORITY_WEIGHT: Record<DialogPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function dialogPriorityLabel(priority: DialogPriority): string {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
  }
}
