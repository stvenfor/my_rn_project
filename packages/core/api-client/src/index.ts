import axios, {AxiosInstance} from 'axios';

let client: AxiosInstance | null = null;
let currentBaseUrl = 'https://www.wanandroid.com/';

export function createApiClient(baseUrl: string): AxiosInstance {
  currentBaseUrl = baseUrl;
  client = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {'Content-Type': 'application/json'},
  });
  client.interceptors.request.use(config => {
    config.headers = config.headers ?? {};
    config.headers['X-App-Env'] = config.headers['X-App-Env'] ?? 'test';
    return config;
  });
  return client;
}

export function getApiClient(): AxiosInstance {
  if (!client) {
    return createApiClient(currentBaseUrl);
  }
  return client;
}

export function reinitializeApiClient(baseUrl: string, envLabel: string): void {
  createApiClient(baseUrl);
  if (client) {
    client.defaults.headers.common['X-App-Env'] = envLabel;
  }
}

export async function fetchWanAndroidBanner(): Promise<
  {title: string; url: string}[]
> {
  const api = getApiClient();
  const res = await api.get('/banner/json');
  const data = res.data?.data ?? [];
  return data.map((item: {title: string; url: string}) => ({
    title: item.title,
    url: item.url,
  }));
}
