import { ActionCreator, AsyncActionCreator, StoreApi } from "../types/state";

export function createAction<P = void, R = void, S = any>(
  type: string,
  handler: (payload: P, store: StoreApi<S>) => R
): ActionCreator<P, R, S> {
  return (payload: P) => (store: StoreApi<S>) => {
    try {
      const result = handler(payload, store);
      return result;
    } catch (error) {
      console.error(`Action ${type} failed:`, error);
      throw error;
    }
  };
}

export function createAsyncAction<P = void, R = void>(
  type: string,
  handler: (payload: P, context: StoreApi<any>) => Promise<R>
): AsyncActionCreator<P, R> {
  return async (payload: P, context: StoreApi<any>) => {
    try {
      return await handler(payload, context);
    } catch (error) {
      console.error(`Async action ${type} failed:`, error);
      throw error;
    }
  };
}
