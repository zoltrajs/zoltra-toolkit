import { useEffect, useState, useCallback } from "react";
import { StoreApi } from "../types/state";
import { getStore } from "./core";

export function useStore<T>(
  store: StoreApi<T>
): [T, StoreApi<T>["setState"], StoreApi<T>["dispatch"]] {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  const dispatch = useCallback(
    async <R>(action: (api: StoreApi<T>) => Promise<R>) => {
      return await store.dispatch(action);
    },
    [store]
  );

  return [state, store.setState, dispatch];
}

export function useNamedStore<T>(
  name: string
): [T, StoreApi<T>["setState"], StoreApi<T>["dispatch"]] {
  const store = getStore<T>(name);
  if (!store) {
    throw new Error(`Store ${name} not found`);
  }
  return useStore(store);
}
