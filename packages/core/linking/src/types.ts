export interface PendingNavigation {
  route: string;
  params?: Record<string, unknown>;
}

export interface LinkingService {
  getInitialUrl(): Promise<string | null>;
  subscribe(callback: (url: string) => void): () => void;
  setPendingNavigation(nav: PendingNavigation | null): void;
  getPendingNavigation(): PendingNavigation | null;
  parseUrl(url: string): PendingNavigation | null;
  consumePendingNavigation(): PendingNavigation | null;
  emit(url: string): void;
}
