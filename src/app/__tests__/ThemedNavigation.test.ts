import {resolveIsDark} from '../resolveIsDark';

describe('resolveIsDark', () => {
  it('follows explicit light/dark', () => {
    expect(resolveIsDark('dark', false)).toBe(true);
    expect(resolveIsDark('light', true)).toBe(false);
  });

  it('follows system when themeMode is system', () => {
    expect(resolveIsDark('system', true)).toBe(true);
    expect(resolveIsDark('system', false)).toBe(false);
  });
});
