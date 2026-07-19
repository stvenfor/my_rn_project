import {RoutePath} from '@core/navigation';
import {registerAuthFeature} from '../registerAuthFeature';

describe('registerAuthFeature', () => {
  it('registers Login, LoginPassword, LoginOtp, and Register', () => {
    const reg = registerAuthFeature();
    expect(reg.moduleId).toBe('auth');
    const names = reg.routes?.map(r => r.name) ?? [];
    expect(names).toEqual(
      expect.arrayContaining([
        RoutePath.login,
        RoutePath.loginPassword,
        RoutePath.loginOtp,
        RoutePath.register,
      ]),
    );
    expect(names).toHaveLength(4);
    for (const route of reg.routes ?? []) {
      expect(route.component).toBeDefined();
    }
  });
});
