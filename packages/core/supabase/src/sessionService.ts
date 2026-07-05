import type {AuthSessionService, User} from '@core/domain';
import {storage} from '@core/storage';

/** 与 Flutter `UserServiceImpl.storageKey` 对齐 */
export const AUTH_USER_SESSION_KEY = 'auth_user_session';

function parseStoredUser(raw: string): User | null {
  try {
    const parsed = JSON.parse(raw) as User;
    if (typeof parsed?.id !== 'string' || parsed.id.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export class InMemoryAuthSessionService implements AuthSessionService {
  private user: User | null = null;

  getUser(): User | null {
    return this.user;
  }

  async setUser(user: User | null): Promise<void> {
    this.user = user;
  }

  async clearSession(): Promise<void> {
    this.user = null;
  }

  isLoggedIn(): boolean {
    return this.user != null;
  }
}

export class PersistentAuthSessionService implements AuthSessionService {
  private user: User | null = null;

  getUser(): User | null {
    return this.user;
  }

  async restoreFromStorage(): Promise<User | null> {
    const raw = await storage.getItem(AUTH_USER_SESSION_KEY);
    if (!raw) {
      this.user = null;
      return null;
    }
    this.user = parseStoredUser(raw);
    return this.user;
  }

  async setUser(user: User | null): Promise<void> {
    this.user = user;
    if (user == null) {
      await storage.removeItem(AUTH_USER_SESSION_KEY);
      return;
    }
    await storage.setItem(AUTH_USER_SESSION_KEY, JSON.stringify(user));
  }

  async clearSession(): Promise<void> {
    this.user = null;
    await storage.removeItem(AUTH_USER_SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return this.user != null;
  }
}

let sessionService: AuthSessionService = new PersistentAuthSessionService();

export function getAuthSessionService(): AuthSessionService {
  return sessionService;
}

export function configureAuthSessionService(next?: AuthSessionService): void {
  sessionService = next ?? new PersistentAuthSessionService();
}

export async function restoreAuthSessionFromStorage(): Promise<User | null> {
  const session = getAuthSessionService();
  if (session instanceof PersistentAuthSessionService) {
    return session.restoreFromStorage();
  }
  return session.getUser();
}
