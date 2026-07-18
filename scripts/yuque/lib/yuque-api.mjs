import {
  getCookieHeader,
  getCsrfToken,
  getRepoConfig,
  loadEnvLocal,
} from './env.mjs';

const API_BASE = 'https://www.yuque.com/api/v2';

function buildHeaders(env = loadEnvLocal()) {
  const cookie = getCookieHeader(env);
  if (!cookie) {
    throw new Error('未配置 YUQUE_COOKIE 或 YUQUE_COOKIE_FULL');
  }
  const headers = {
    Cookie: cookie,
    'User-Agent': 'yuque-sync/1.0',
    Accept: 'application/json',
  };
  const csrf = getCsrfToken(env);
  if (csrf) {
    headers['x-csrf-token'] = csrf;
  }
  return headers;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(path, options = {}, retries = 3) {
  const url = `${API_BASE}${path}`;
  const headers = { ...buildHeaders(), ...(options.headers || {}) };

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 429 && attempt < retries) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    return { ok: res.ok, status: res.status, data };
  }
  throw new Error(`请求失败: ${path}`);
}

export async function getCurrentUser() {
  return request('/user');
}

export async function getDoc(group, book, slug) {
  return request(`/repos/${group}/${book}/docs/${slug}`);
}

export async function updateDoc(group, book, slug, body, format = 'markdown') {
  return request(`/repos/${group}/${book}/docs/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, format }),
  });
}

export async function checkAuth() {
  const res = await getCurrentUser();
  return {
    ok: res.ok,
    login: res.data?.data?.login,
    status: res.status,
  };
}

export { sleep };
