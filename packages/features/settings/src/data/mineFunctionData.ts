import type {MineFunctionItem} from '../models/mineFunctionItem';

export const mineFunctionCatalog: MineFunctionItem[] = [
  {
    id: 'sms',
    title: '短信模板',
    subtitle: '一键发送 轻松快捷',
    accentColor: '#E8F8EF',
    iconColor: '#52C41A',
    iconKey: 'sms',
  },
  {
    id: 'calculator',
    title: '购车计算器',
    subtitle: '全款/贷款/保险全能算',
    accentColor: '#E8F0FF',
    iconColor: '#1890FF',
    iconKey: 'calculator',
  },
  {
    id: 'used_car',
    title: '二手车',
    subtitle: '置换/专卖/估价',
    accentColor: '#E8F0FF',
    iconColor: '#1890FF',
    iconKey: 'used_car',
  },
  {
    id: 'short_video',
    title: '小视频',
    subtitle: '用小视频秀车秀店',
    accentColor: '#F0E8FF',
    iconColor: '#9254DE',
    iconKey: 'short_video',
  },
  {
    id: 'after_sales',
    title: '售后专区',
    subtitle: '售后维修保养记录',
    accentColor: '#FFF8E8',
    iconColor: '#FAAD14',
    iconKey: 'after_sales',
  },
  {
    id: 'qr_pay',
    title: '店铺收款码',
    subtitle: '常见问题 功能介绍',
    accentColor: '#E8F8EF',
    iconColor: '#52C41A',
    iconKey: 'qr_pay',
  },
  {
    id: 'qa',
    title: '选买问答',
    subtitle: '在线解答客户问题',
    accentColor: '#E8F0FF',
    iconColor: '#1890FF',
    iconKey: 'qa',
  },
  {
    id: 'poster',
    title: '商家海报',
    subtitle: '置换/专卖/估价',
    accentColor: '#FFF8E8',
    iconColor: '#FAAD14',
    iconKey: 'poster',
  },
];

export const defaultMineFunctionOrderIds = [
  'sms',
  'calculator',
  'used_car',
  'short_video',
  'after_sales',
  'qr_pay',
  'qa',
  'poster',
];

const catalogById = new Map(
  mineFunctionCatalog.map(item => [item.id, item] as const),
);

export function resolveOrderedMineFunctions(ids: string[]): MineFunctionItem[] {
  const resolved: MineFunctionItem[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    const item = catalogById.get(id);
    if (item && !seen.has(id)) {
      seen.add(id);
      resolved.push(item);
    }
  }

  for (const item of mineFunctionCatalog) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      resolved.push(item);
    }
  }

  return resolved;
}
