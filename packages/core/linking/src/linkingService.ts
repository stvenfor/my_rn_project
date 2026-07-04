import type {LinkingService, PendingNavigation} from './types';

const ROUTE_MAP: Record<string, string> = {
  '/chat': 'ChatTab',
  '/home': 'HomeTab',
  '/community': 'CommunityTab',
  '/mine': 'MineTab',
  '/login': 'Login',
  '/music': 'MusicList',
};

export class DefaultLinkingService implements LinkingService {
  private pending: PendingNavigation | null = null;
  private listeners = new Set<(url: string) => void>();

  async getInitialUrl(): Promise<string | null> {
    return null;
  }

  subscribe(callback: (url: string) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  setPendingNavigation(nav: PendingNavigation | null): void {
    this.pending = nav;
  }

  getPendingNavigation(): PendingNavigation | null {
    return this.pending;
  }

  consumePendingNavigation(): PendingNavigation | null {
    const next = this.pending;
    this.pending = null;
    return next;
  }

  parseUrl(url: string): PendingNavigation | null {
    try {
      const parsed = new URL(url);
      const route = ROUTE_MAP[parsed.pathname];
      if (!route) {
        return null;
      }
      const params: Record<string, unknown> = {};
      parsed.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return {route, params: Object.keys(params).length ? params : undefined};
    } catch {
      return null;
    }
  }

  emit(url: string): void {
    const nav = this.parseUrl(url);
    if (nav) {
      this.pending = nav;
    }
    this.listeners.forEach(listener => listener(url));
  }
}

let service: LinkingService = new DefaultLinkingService();

export function getLinkingService(): LinkingService {
  return service;
}

export function configureLinkingService(next?: LinkingService): void {
  service = next ?? new DefaultLinkingService();
}
