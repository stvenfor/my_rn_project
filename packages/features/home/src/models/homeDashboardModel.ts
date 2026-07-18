export interface HomeFeatureItem {
  label: string;
  emoji?: string;
  imageUrl?: string;
  /** Local all_services icon key (preferred over remote imageUrl). */
  iconKey?: string;
}

export interface HomeQuickAction {
  title: string;
  subtitle: string;
  actionLabel: string;
  emoji?: string;
  imageUrl?: string;
}

export interface HomeMetric {
  value: string;
  label: string;
}

export interface HomeMetricDetail {
  value: string;
  label: string;
  actionLabel: string;
}

export interface HomeServiceItem {
  label: string;
  emoji?: string;
  imageUrl?: string;
  badge?: string;
}

export interface HomeContactItem {
  title: string;
  subtitle: string;
  emoji?: string;
  imageUrl?: string;
  isAvatar?: boolean;
  trailingType?: 'chat' | 'phone' | 'chevron';
}

export interface HomeNewsItem {
  title: string;
  source: string;
  date: string;
  imageUrl?: string;
}

export interface HomeDashboardData {
  storeName: string;
  features: HomeFeatureItem[];
  quickActions: HomeQuickAction[];
  metricsToday: HomeMetric[];
  metricsYesterday: HomeMetric[];
  metricsMonth: HomeMetric[];
  metricDetails: HomeMetricDetail[];
  services: HomeServiceItem[];
  contacts: HomeContactItem[];
  news: HomeNewsItem[];
}

export const METRIC_TABS = ['今日', '昨日', '近30天'] as const;
