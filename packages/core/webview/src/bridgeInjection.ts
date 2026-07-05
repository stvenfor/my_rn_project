import {getWebAssetScript} from './webAssetContent';
import {WebBridgeAssets} from './webPageConfig';

const BRIDGE_SCRIPT = getWebAssetScript(WebBridgeAssets.icsAppInjection);

export const BRIDGE_INJECTION = `${BRIDGE_SCRIPT}
window.dispatchEvent(new Event('rnReady'));
window.dispatchEvent(new Event('flutterReady'));
true;
`;

export function buildParamsInjectionScript(
  params: Record<string, unknown>,
): string {
  const json = JSON.stringify(params ?? {});
  return `window.__RN_PARAMS__ = ${json};
window.__FLUTTER_PARAMS__ = ${json};
true;`;
}

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
