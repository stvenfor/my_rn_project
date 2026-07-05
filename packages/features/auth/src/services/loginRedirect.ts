import type {RoutePath} from '@core/navigation';

type PendingRoute = (typeof RoutePath)[keyof typeof RoutePath];

let pendingRoute: PendingRoute | null = null;

export const LoginRedirect = {
  setPending(route: PendingRoute): void {
    pendingRoute = route;
  },

  peek(): PendingRoute | null {
    return pendingRoute;
  },

  takePending(): PendingRoute | null {
    const route = pendingRoute;
    pendingRoute = null;
    return route;
  },

  clear(): void {
    pendingRoute = null;
  },
};
