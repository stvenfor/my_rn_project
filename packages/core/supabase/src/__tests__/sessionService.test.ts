import {storage} from '@core/storage';
import {
  AUTH_USER_SESSION_KEY,
  configureAuthSessionService,
  getAuthSessionService,
  PersistentAuthSessionService,
  restoreAuthSessionFromStorage,
} from '../sessionService';

describe('auth session service', () => {
  beforeEach(async () => {
    configureAuthSessionService();
    await storage.removeItem(AUTH_USER_SESSION_KEY);
  });

  it('syncs login and logout through single session contract', async () => {
    const session = getAuthSessionService();
    expect(session.isLoggedIn()).toBe(false);
    await session.setUser({id: 'u1', email: 'a@b.com'});
    expect(session.isLoggedIn()).toBe(true);
    expect(session.getUser()?.email).toBe('a@b.com');
    await session.clearSession();
    expect(session.isLoggedIn()).toBe(false);
  });

  it('persists user to storage and restores on next launch', async () => {
    const user = {id: 'u1', email: 'a@b.com', displayName: 'Alice'};
    await getAuthSessionService().setUser(user);

    configureAuthSessionService(new PersistentAuthSessionService());
    expect(getAuthSessionService().isLoggedIn()).toBe(false);

    const restored = await restoreAuthSessionFromStorage();
    expect(restored).toEqual(user);
    expect(getAuthSessionService().isLoggedIn()).toBe(true);
  });

  it('clears persisted session on logout', async () => {
    await getAuthSessionService().setUser({id: 'u1', email: 'a@b.com'});
    await getAuthSessionService().clearSession();

    configureAuthSessionService(new PersistentAuthSessionService());
    const restored = await restoreAuthSessionFromStorage();
    expect(restored).toBeNull();
  });
});
