import type {AuthSessionService, User} from '@core/domain';

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

let sessionService: AuthSessionService = new InMemoryAuthSessionService();

export function getAuthSessionService(): AuthSessionService {
  return sessionService;
}

export function configureAuthSessionService(next?: AuthSessionService): void {
  sessionService = next ?? new InMemoryAuthSessionService();
}
