import {
  escapeHtmlAttr,
  sanitizeHttpUrl,
} from '../webviewVideoSafety';

describe('webviewVideoSafety', () => {
  it('sanitizes http(s) only', () => {
    expect(sanitizeHttpUrl('https://cdn.example/a.mp4')).toContain('https://');
    expect(sanitizeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeHttpUrl('file:///tmp/x')).toBeNull();
    expect(sanitizeHttpUrl('')).toBeNull();
  });

  it('escapes html attribute characters', () => {
    expect(escapeHtmlAttr('a"b<c>&')).toBe('a&quot;b&lt;c&gt;&amp;');
  });
});
