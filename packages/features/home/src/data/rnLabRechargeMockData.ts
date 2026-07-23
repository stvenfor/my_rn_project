export type RechargeServiceId =
  | 'phone'
  | 'oil'
  | 'netease'
  | 'iqiyi'
  | 'qcoin'
  | 'zhihu';

export type RechargePackage = {
  id: string;
  title: string;
  price: string;
  badge?: string;
};

export type RechargeService = {
  id: RechargeServiceId;
  tabLabel: string;
  title: string;
  subtitle: string;
  discount: string;
  iconGlyph: string;
  iconBg: string;
  theme: [string, string];
  sheetTint: string;
  inputPlaceholder: string;
  sectionTitle: string;
  packages: RechargePackage[];
};

export const RECHARGE_SERVICES: RechargeService[] = [
  {
    id: 'phone',
    tabLabel: '话费充值',
    title: '话费充值',
    subtitle: '72小时慢充',
    discount: '95折起',
    iconGlyph: '📱',
    iconBg: '#E8F6FF',
    theme: ['#2F9BFF', '#7ED0FF'],
    sheetTint: '#F3FAFF',
    inputPlaceholder: '请输入手机号码',
    sectionTitle: '充值面额',
    packages: [
      {id: 'p10', title: '10元', price: '售价 9.70', badge: '优惠'},
      {id: 'p30', title: '30元', price: '售价 29.10'},
      {id: 'p50', title: '50元', price: '售价 48.50'},
      {id: 'p100', title: '100元', price: '售价 97.00'},
      {id: 'p200', title: '200元', price: '售价 194.00'},
      {id: 'p300', title: '300元', price: '售价 291.00', badge: '优惠'},
    ],
  },
  {
    id: 'oil',
    tabLabel: '油卡充值',
    title: '油卡充值',
    subtitle: '支持中石油中石化',
    discount: '62折起',
    iconGlyph: '⛽',
    iconBg: '#FFECEC',
    theme: ['#FF6B6B', '#FF9A8B'],
    sheetTint: '#FFF6F6',
    inputPlaceholder: '请输入油卡卡号',
    sectionTitle: '充值面额',
    packages: [
      {id: 'o100', title: '100元', price: '售价 98.00', badge: '优惠'},
      {id: 'o200', title: '200元', price: '售价 196.00'},
      {id: 'o500', title: '500元', price: '售价 490.00'},
      {id: 'o1000', title: '1000元', price: '售价 980.00'},
    ],
  },
  {
    id: 'netease',
    tabLabel: '网易云音乐',
    title: '网易云音乐',
    subtitle: '7x24小时秒到',
    discount: '62折起',
    iconGlyph: '🎵',
    iconBg: '#FFE8EC',
    theme: ['#E85A5A', '#FF8A8A'],
    sheetTint: '#FFF5F5',
    inputPlaceholder: '请输入网易云音乐会员账号',
    sectionTitle: '充值时间',
    packages: [
      {id: 'n1', title: '黑胶月卡', price: '售价 13.00', badge: '优惠'},
      {id: 'n2', title: '黑胶季卡', price: '售价 38.00'},
      {id: 'n3', title: '黑胶年卡', price: '售价 128.00'},
      {id: 'n4', title: '豪华年卡', price: '售价 188.00'},
    ],
  },
  {
    id: 'iqiyi',
    tabLabel: '爱奇艺会员',
    title: '爱奇艺会员',
    subtitle: '7x24小时秒到',
    discount: '58折起',
    iconGlyph: '▶️',
    iconBg: '#EAF9EF',
    theme: ['#E85A5A', '#FF8A8A'],
    sheetTint: '#FFF5F5',
    inputPlaceholder: '请输入爱奇艺账号',
    sectionTitle: '充值时间',
    packages: [
      {id: 'i1', title: '黄金月卡', price: '售价 15.00', badge: '优惠'},
      {id: 'i2', title: '黄金季卡', price: '售价 42.00'},
      {id: 'i3', title: '黄金年卡', price: '售价 148.00'},
      {id: 'i4', title: '星钻年卡', price: '售价 218.00'},
    ],
  },
  {
    id: 'qcoin',
    tabLabel: 'Q币充值',
    title: 'Q币充值',
    subtitle: '官方通道秒到',
    discount: '98折起',
    iconGlyph: '🐧',
    iconBg: '#EAF3FF',
    theme: ['#3B82F6', '#60A5FA'],
    sheetTint: '#F3F8FF',
    inputPlaceholder: '请输入QQ号',
    sectionTitle: '充值面额',
    packages: [
      {id: 'q10', title: '10 Q币', price: '售价 9.80', badge: '优惠'},
      {id: 'q50', title: '50 Q币', price: '售价 49.00'},
      {id: 'q100', title: '100 Q币', price: '售价 98.00'},
      {id: 'q200', title: '200 Q币', price: '售价 196.00'},
    ],
  },
  {
    id: 'zhihu',
    tabLabel: '知乎盐选',
    title: '知乎盐选会员',
    subtitle: '7x24小时秒到',
    discount: '92折起',
    iconGlyph: '知',
    iconBg: '#E8F1FF',
    theme: ['#3B82F6', '#7DD3FC'],
    sheetTint: '#F3F8FF',
    inputPlaceholder: '请输入知乎账号',
    sectionTitle: '充值面额',
    packages: [
      {id: 'z1', title: '7日卡', price: '售价 3.99', badge: '优惠'},
      {id: 'z2', title: '月卡', price: '售价 15.00'},
      {id: 'z3', title: '季卡', price: '售价 29.20'},
      {id: 'z4', title: '半年卡', price: '售价 45.20'},
      {id: 'z5', title: '年卡', price: '售价 152.00'},
    ],
  },
];

export const RECHARGE_TABS = [
  {id: 'home', label: '首页'},
  {id: 'order', label: '订单'},
  {id: 'recharge', label: '充'},
  {id: 'discover', label: '发现'},
  {id: 'mine', label: '我的'},
] as const;
