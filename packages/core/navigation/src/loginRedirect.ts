/** Route name pending after login (must be a RootStack screen name). */
export type PendingLoginRoute = string;

let pendingRoute: PendingLoginRoute | null = null;

/** Cross-feature pending route after login (e.g. used-car entry). */
export const LoginRedirect = {
  setPending(route: PendingLoginRoute): void {
    pendingRoute = route;
  },

  peek(): PendingLoginRoute | null {
    return pendingRoute;
  },

  takePending(): PendingLoginRoute | null {
    const route = pendingRoute;
    pendingRoute = null;
    return route;
  },

  clear(): void {
    pendingRoute = null;
  },
};
