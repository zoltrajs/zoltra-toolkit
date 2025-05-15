import { useEffect, useState, useCallback } from "react";
import { StoreApi } from "../types/state";
import { getStore } from "./core";

export function useStore<T>(
  store: StoreApi<T>
): [
  T,
  StoreApi<T>["setState"],
  StoreApi<T>["dispatch"],
  StoreApi<T>["dispatchAsync"]
] {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  const dispatch = useCallback(
    (action: (api: StoreApi<T>) => void) => {
      return store.dispatch(action);
    },
    [store]
  );

  const dispatchAsync = useCallback(
    async <R>(action: (api: StoreApi<T>) => Promise<R>) => {
      return await store.dispatchAsync(action);
    },
    [store]
  );

  return [state, store.setState, dispatch, dispatchAsync];
}

export function useNamedStore<T>(
  name: string
): [
  T,
  StoreApi<T>["setState"],
  StoreApi<T>["dispatch"],
  StoreApi<T>["dispatchAsync"]
] {
  const store = getStore<T>(name);
  if (!store) {
    throw new Error(`Store ${name} not found`);
  }
  return useStore(store);
}
