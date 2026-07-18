export interface TransactionModel {
  id: number;
  userId?: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionPage {
  list: TransactionModel[];
  total?: number;
}

function mapItem(raw: Record<string, unknown>): TransactionModel {
  return {
    id: Number(raw.id),
    userId: (raw.user_id ?? raw.userId) as string | undefined,
    type: String(raw.type ?? ''),
    category: String(raw.category ?? ''),
    amount: Number(raw.amount ?? 0),
    date: String(raw.date ?? ''),
    note: raw.note as string | undefined,
    createdAt: (raw.created_at ?? raw.createdAt) as string | undefined,
    updatedAt: (raw.updated_at ?? raw.updatedAt) as string | undefined,
  };
}

function parseList(json: unknown): TransactionPage {
  const map = json as Record<string, unknown>;
  if (map && typeof map === 'object' && 'code' in map) {
    const data = (map.data ?? {}) as Record<string, unknown>;
    const listRaw = (data.list ?? data.items ?? []) as Record<
      string,
      unknown
    >[];
    return {
      list: listRaw.map(mapItem),
      total: data.total as number | undefined,
    };
  }
  const listRaw = (map.items ?? map.list ?? []) as Record<string, unknown>[];
  return {list: listRaw.map(mapItem)};
}

function parseDetail(json: unknown): TransactionModel {
  const map = json as Record<string, unknown>;
  if (map && typeof map === 'object' && 'code' in map) {
    const data = map.data as Record<string, unknown> | null;
    if (!data) {
      throw new Error('交易记录不存在');
    }
    return mapItem(data);
  }
  return mapItem(map);
}

export function formatTransactionAmount(amount: number): string {
  if (Math.abs(amount) >= 10000) {
    return `¥ ${(amount / 10000).toFixed(2)} 万`;
  }
  return `¥ ${amount.toFixed(2)}`;
}

export function isIncomeType(type: string): boolean {
  return type === 'income' || type === '收入';
}

export function isExpenseType(type: string): boolean {
  return type === 'expense' || type === '支出';
}

const MOCK_LIST: TransactionModel[] = [
  {
    id: 1001,
    type: '收入',
    category: '二手车销售',
    amount: 128000,
    date: '2026-07-01',
    note: '本田雅阁成交',
    createdAt: '2026-07-01 10:00:00',
    updatedAt: '2026-07-01 10:00:00',
  },
  {
    id: 1002,
    type: '支出',
    category: '整备费用',
    amount: 3200,
    date: '2026-07-02',
    note: '漆面修复',
    createdAt: '2026-07-02 14:20:00',
  },
  {
    id: 1003,
    type: '收入',
    category: '过户代办',
    amount: 800,
    date: '2026-07-03',
  },
];

function mapHttpError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (/401|unauthorized|expired/i.test(message)) {
    return new Error('登录已过期，请重新登录');
  }
  if (/other device|其他设备/i.test(message)) {
    return new Error('账号已在其他设备登录，请重新登录');
  }
  if (/Network|ECONNREFUSED|Failed to fetch|timeout/i.test(message)) {
    return new Error(
      '无法连接后端，请确认 my_go_study 已启动（默认 http://127.0.0.1:8080）',
    );
  }
  return error instanceof Error ? error : new Error(message);
}

export async function fetchTransactionPage(params: {
  page: number;
  size?: number;
  type?: string;
}): Promise<TransactionPage> {
  const size = params.size ?? 20;
  try {
    const {getApiClient} = await import('@core/api-client');
    const client = getApiClient();
    const res = await client.get('/api/v1/transactions', {
      params: {
        limit: size,
        offset: params.page * size,
        ...(params.type ? {type: params.type} : {}),
      },
    });
    return parseList(res.data);
  } catch (error) {
    if (params.page === 0) {
      // Dev fallback so UI remains usable without my_go_study.
      return {list: MOCK_LIST, total: MOCK_LIST.length};
    }
    throw mapHttpError(error);
  }
}

export async function fetchTransactionById(
  id: number,
): Promise<TransactionModel> {
  try {
    const {getApiClient} = await import('@core/api-client');
    const client = getApiClient();
    const res = await client.get(`/api/v1/transactions/${id}`);
    return parseDetail(res.data);
  } catch (error) {
    const mock = MOCK_LIST.find(item => item.id === id);
    if (mock) {
      return mock;
    }
    throw mapHttpError(error);
  }
}
