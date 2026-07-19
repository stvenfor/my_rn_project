/**
 * Escape a string for safe use inside an HTML attribute value.
 */
export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Allow only http(s) URLs for embedding in WebView HTML video players.
 */
export function sanitizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Pause + detach media element inside a WebView HTML player. */
export const WEBVIEW_VIDEO_TEARDOWN_JS = `(function(){
  var p = document.getElementById('player');
  if (p) {
    try { p.pause(); } catch (e) {}
    try { p.removeAttribute('src'); p.load(); } catch (e) {}
  }
  true;
})();`;
