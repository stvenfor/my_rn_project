import {
  configureAuthSessionService,
  getAuthSessionService,
} from '../sessionService';

describe('auth session service', () => {
  beforeEach(() => {
    configureAuthSessionService();
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
});
