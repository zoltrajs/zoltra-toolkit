import { StoreApi, StoreOptions, Listener, Middleware } from "../types/state";

const stores = new Map<string, StoreApi<any>>();

export function createStore<T extends object>(
  initialState: T,
  options?: StoreOptions<T>
): StoreApi<T> {
  // Persistence setup
  const storageKey =
    typeof options?.persist === "string"
      ? options.persist
      : options?.persist?.key;
  const engine =
    typeof options?.persist === "object" ? options.persist.engine : undefined;
  const whitelist =
    typeof options?.persist === "object"
      ? options.persist.whitelist
      : undefined;
  const blacklist =
    typeof options?.persist === "object"
      ? options.persist.blacklist
      : undefined;

  let state = loadPersistedState() || initialState;
  const listeners = new Set<Listener<T>>();
  const middleware = options?.middleware || [];

  function loadPersistedState(): T | null {
    if (!storageKey) return null;
    try {
      const saved =
        engine?.getItem(storageKey) || localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("State load failed", e);
      return null;
    }
  }

  function savePersistedState(): void {
    if (!storageKey) return;
    try {
      let dataToSave = { ...state };

      if (whitelist) {
        dataToSave = whitelist.reduce((acc, key) => {
          acc[key] = state[key];
          return acc;
        }, {} as Partial<T>) as T;
      } else if (blacklist) {
        blacklist.forEach((key) => {
          delete dataToSave[key];
        });
      }

      const serialized = JSON.stringify(dataToSave);
      engine?.setItem(storageKey, serialized) ||
        localStorage.setItem(storageKey, serialized);
    } catch (e) {
      console.warn("State save failed", e);
    }
  }

  function applyMiddleware(action: unknown, newState: T): T {
    return middleware.reduce((st, mw) => mw(st, action), newState);
  }

  const api: StoreApi<T> = {
    getState: () => state,
    setState: (action) => {
      const newState =
        typeof action === "function"
          ? { ...state, ...action(state) }
          : { ...state, ...action };

      state = applyMiddleware(action, newState);
      savePersistedState();
      listeners.forEach((listener) => listener(state));
      return state;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispatch: (action) => {
      return action(api);
    },
    dispatchAsync: async (asyncAction) => {
      try {
        return await asyncAction(api);
      } catch (error) {
        console.error("Async action failed:", error);
        throw error;
      }
    },
  };

  // Register global instance
  if (options?.name) {
    stores.set(options.name, api);
  }

  return api;
}

export function getStore<T>(name: string): StoreApi<T> | undefined {
  return stores.get(name);
}
