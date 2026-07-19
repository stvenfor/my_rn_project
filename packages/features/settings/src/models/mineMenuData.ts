export type MineQuickServiceItem = {
  id: 'mall' | 'wallet' | 'course' | 'order';
  label: string;
  iconColor: string;
  badge?: string;
  icon: MineQuickServiceIcon;
};

export type MineQuickServiceIcon = 'bag' | 'creditcard' | 'play_rectangle' | 'doc_text';

export type MineMenuItem = {
  id:
    | 'cooperation'
    | 'reminder'
    | 'invite'
    | 'fan_group'
    | 'feedback'
    | 'settings';
  label: string;
  icon: MineMenuIcon;
  showBadge?: boolean;
  destructive?: boolean;
};

export type MineMenuIcon =
  | 'person_add'
  | 'bell'
  | 'person_2'
  | 'chat_bubble_2'
  | 'tag'
  | 'gear';

/** Aligns with Flutter `MineQuickServiceData.items`. */
export const MINE_QUICK_SERVICE_ITEMS: MineQuickServiceItem[] = [
  {
    id: 'mall',
    label: '商城',
    icon: 'bag',
    iconColor: '#007AFF',
    badge: 'HOT',
  },
  {
    id: 'wallet',
    label: '我的钱包',
    icon: 'creditcard',
    iconColor: '#5856D6',
  },
  {
    id: 'course',
    label: '我的课程',
    icon: 'play_rectangle',
    iconColor: '#FF9500',
  },
  {
    id: 'order',
    label: '我的订单',
    icon: 'doc_text',
    iconColor: '#34C759',
  },
];

/** Aligns with Flutter `MineMenuData.items`. */
export const MINE_MENU_ITEMS: MineMenuItem[] = [
  {id: 'cooperation', label: '商务合作', icon: 'person_add'},
  {id: 'reminder', label: '提醒事项', icon: 'bell'},
  {id: 'invite', label: '邀请好友', icon: 'person_2'},
  {id: 'fan_group', label: '粉丝群', icon: 'chat_bubble_2', showBadge: true},
  {id: 'feedback', label: '意见反馈', icon: 'tag'},
  {id: 'settings', label: '设置', icon: 'gear'},
];
