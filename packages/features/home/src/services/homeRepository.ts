import type {HomeDashboardData} from '../models/homeDashboardModel';

export async function loadDashboard(): Promise<HomeDashboardData> {
  await new Promise<void>(resolve => setTimeout(resolve, 300));
  return {
    storeName: '[4S]北京沃德龙鼎吉利',
    features: [
      {label: '销售顾问', imageUrl: 'https://picsum.photos/seed/sales/200/200'},
      {label: '生活服务', imageUrl: 'https://picsum.photos/seed/life/200/200'},
      {label: '二手车', imageUrl: 'https://picsum.photos/seed/usedcar/200/200'},
      {
        label: '新车关注',
        imageUrl: 'https://picsum.photos/seed/newcar/200/200',
      },
      {
        label: '客户管理',
        imageUrl: 'https://picsum.photos/seed/customer/200/200',
      },
      {label: '订单中心', imageUrl: 'https://picsum.photos/seed/order/200/200'},
      {label: '数据分析', imageUrl: 'https://picsum.photos/seed/data/200/200'},
      {label: '直播带货', imageUrl: 'https://picsum.photos/seed/live/200/200'},
      {
        label: '营销活动',
        imageUrl: 'https://picsum.photos/seed/market/200/200',
      },
      {label: '更多', imageUrl: 'https://picsum.photos/seed/more/200/200'},
    ],
    quickActions: [
      {
        title: '新伙伴待确认',
        subtitle: '3 位新成员等待审核',
        actionLabel: '去处理',
        imageUrl: 'https://picsum.photos/seed/partner/200/200',
      },
      {
        title: '待跟进客户',
        subtitle: '今日 5 位意向客户',
        actionLabel: '去查看',
        imageUrl: 'https://picsum.photos/seed/follow/200/200',
      },
      {
        title: '订单待审核',
        subtitle: '2 笔新车订单',
        actionLabel: '去处理',
        imageUrl: 'https://picsum.photos/seed/review/200/200',
      },
      {
        title: '售后预约',
        subtitle: '4 位客户今日到店',
        actionLabel: '去查看',
        imageUrl: 'https://picsum.photos/seed/service/200/200',
      },
    ],
    metricsToday: [
      {value: '99', label: '意向客户'},
      {value: '2', label: '新车订单'},
      {value: '999.8', label: '成交额(万)'},
      {value: '15', label: '试驾预约'},
    ],
    metricsYesterday: [
      {value: '86', label: '意向客户'},
      {value: '1', label: '新车订单'},
      {value: '520.0', label: '成交额(万)'},
      {value: '12', label: '试驾预约'},
    ],
    metricsMonth: [
      {value: '1280', label: '意向客户'},
      {value: '45', label: '新车订单'},
      {value: '8600.5', label: '成交额(万)'},
      {value: '320', label: '试驾预约'},
    ],
    metricDetails: [
      {value: '8', label: '待交车', actionLabel: '详情 >'},
      {value: '3', label: '待回访', actionLabel: '详情 >'},
      {value: '12', label: '待跟进', actionLabel: '详情 >'},
    ],
    services: [
      {
        label: '朋友圈',
        imageUrl: 'https://picsum.photos/seed/moment/200/200',
        badge: '热门',
      },
      {label: '视频号', imageUrl: 'https://picsum.photos/seed/video/200/200'},
      {
        label: '直播',
        imageUrl: 'https://picsum.photos/seed/broadcast/200/200',
        badge: '新品',
      },
      {
        label: '素材库',
        imageUrl: 'https://picsum.photos/seed/material/200/200',
      },
      {label: '话术库', imageUrl: 'https://picsum.photos/seed/script/200/200'},
      {label: '培训', imageUrl: 'https://picsum.photos/seed/training/200/200'},
      {
        label: '竞品分析',
        imageUrl: 'https://picsum.photos/seed/compete/200/200',
      },
      {label: '更多', imageUrl: 'https://picsum.photos/seed/extramore/200/200'},
    ],
    contacts: [
      {
        title: '李大仁',
        subtitle: '专属客户顾问 · 金牌销售',
        imageUrl: 'https://picsum.photos/seed/advisor/200/200',
        isAvatar: true,
      },
      {
        title: 'AI在线咨询',
        subtitle: '7×24 小时智能客服',
        imageUrl: 'https://picsum.photos/seed/aibot/200/200',
        trailingType: 'chat',
      },
      {
        title: '400 售后热线',
        subtitle: '工作日 9:00-18:00',
        imageUrl: 'https://picsum.photos/seed/hotline/200/200',
        trailingType: 'phone',
      },
    ],
    news: [
      {
        title: '2024年新能源汽车市场趋势分析报告发布',
        source: '汽车之家行业频道',
        date: '2024.05.11',
        imageUrl: 'https://picsum.photos/seed/news1/400/200',
      },
      {
        title: '吉利星越L新款上市，配置全面升级',
        source: '汽车之家',
        date: '2024.05.10',
        imageUrl: 'https://picsum.photos/seed/news2/400/200',
      },
      {
        title: '经销商数字化转型白皮书：从流量到留量',
        source: 'i车商资讯',
        date: '2024.05.09',
        imageUrl: 'https://picsum.photos/seed/news3/400/200',
      },
    ],
  };
}
