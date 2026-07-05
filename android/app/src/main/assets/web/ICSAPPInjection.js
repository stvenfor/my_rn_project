function _initRNBridge() {
  if (window.__RN_BRIDGE_INITIALIZED__) {
    return;
  }
  window.__RN_BRIDGE_INITIALIZED__ = true;
  window.__bridgeCallbacks = window.__bridgeCallbacks || {};

  var ua = navigator.userAgent || '';
  var isIOS =
    ua.indexOf('iPhone') > -1 ||
    ua.indexOf('iPad') > -1 ||
    ua.indexOf('iPod') > -1;
  var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
  var isHarmony = ua.indexOf('HarmonyOS') > -1 || ua.indexOf('OpenHarmony') > -1;

  window.__bridgeResolve = function (id, result) {
    var cb = window.__bridgeCallbacks[id];
    if (cb) {
      cb.resolve(result);
      delete window.__bridgeCallbacks[id];
    }
  };

  window.__bridgeReject = function (id, error) {
    var cb = window.__bridgeCallbacks[id];
    if (cb) {
      cb.reject(error);
      delete window.__bridgeCallbacks[id];
    }
  };

  function invoke(funcName, args) {
    var payload = args || {};
    return new Promise(function (resolve, reject) {
      if (!window.ReactNativeWebView) {
        reject('ReactNativeWebView unavailable');
        return;
      }
      var callbackId =
        'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      window.__bridgeCallbacks[callbackId] = {resolve: resolve, reject: reject};
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: funcName,
          payload: payload,
          callbackId: callbackId,
        }),
      );
    });
  }

  window.ICSJavascriptBridge = {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isHarmony: isHarmony,
    invoke: invoke,
  };
}

_initRNBridge();
