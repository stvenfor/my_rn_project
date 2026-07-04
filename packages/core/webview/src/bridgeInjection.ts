export const BRIDGE_INJECTION = `
(function() {
  if (window.__RN_BRIDGE_INITIALIZED__) return;
  window.__RN_BRIDGE_INITIALIZED__ = true;
  window.__bridgeCallbacks = {};
  window.__bridgeResolve = function(id, result) {
    var cb = window.__bridgeCallbacks[id];
    if (cb) {
      cb.resolve(result);
      delete window.__bridgeCallbacks[id];
    }
  };
  window.__bridgeReject = function(id, error) {
    var cb = window.__bridgeCallbacks[id];
    if (cb) {
      cb.reject(error);
      delete window.__bridgeCallbacks[id];
    }
  };
  var ua = navigator.userAgent;
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  function invoke(funcName, args) {
    var payload = args || {};
    return new Promise(function(resolve, reject) {
      if (!window.ReactNativeWebView) {
        reject('ReactNativeWebView unavailable');
        return;
      }
      var callbackId = 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      window.__bridgeCallbacks[callbackId] = { resolve: resolve, reject: reject };
      window.ReactNativeWebView.postMessage(JSON.stringify({
        action: funcName,
        payload: payload,
        callbackId: callbackId
      }));
    });
  }
  window.ICSJavascriptBridge = {
    isIOS: isIOS,
    isAndroid: isAndroid,
    invoke: invoke
  };
  window.dispatchEvent(new Event('rnReady'));
})();
true;
`;

export function buildBridgeResponseScript(
  callbackId: string,
  result: Record<string, unknown>,
): string {
  return `window.__bridgeResolve(${JSON.stringify(
    callbackId,
  )}, ${JSON.stringify(result)}); true;`;
}

export function buildBridgeErrorScript(
  callbackId: string,
  message: string,
): string {
  return `window.__bridgeReject(${JSON.stringify(callbackId)}, ${JSON.stringify(
    message,
  )}); true;`;
}
