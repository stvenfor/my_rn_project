import {DefaultLinkingService} from '../linkingService';

describe('@core/linking', () => {
  it('parses deep link paths into pending navigation', () => {
    const service = new DefaultLinkingService();
    const nav = service.parseUrl('myapp://app/login?from=push');
    expect(nav).toEqual({route: 'Login', params: {from: 'push'}});
  });
});
