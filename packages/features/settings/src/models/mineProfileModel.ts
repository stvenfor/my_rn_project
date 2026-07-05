import type {MineStatModel} from './mineStatModel';

export interface MineProfileModel {
  displayName: string;
  avatarUrl: string | null;
  roleBadge: string;
  storeName: string;
  maskedPhone: string;
  stats: MineStatModel[];
}

export const guestStats: MineStatModel[] = [
  {value: '0', label: '加入天数'},
  {value: '0', label: '员工数'},
  {value: '0', label: '店铺天数'},
  {value: '0', label: '累计客户'},
];

export const demoStats: MineStatModel[] = [
  {value: '1028', label: '加入天数'},
  {value: '28', label: '员工数'},
  {value: '2059', label: '店铺天数'},
  {value: '9366', label: '累计客户'},
];
