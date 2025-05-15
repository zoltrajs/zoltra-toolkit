export type Listener<T> = (state: T) => void;
export type Unsubscribe = () => void;
export type Middleware<T> = (state: T, action: any) => T;
export type ActionCreator<P = void, R = void, S = any> = (
  payload: P
) => (store: StoreApi<S>) => R;
export type AsyncActionCreator<P, R> = (
  payload: P,
  context: StoreApi<any>
) => Promise<R>;

export interface StoreApi<T> {
  getState: () => T;
  setState: (action: Partial<T> | ((prev: T) => Partial<T>)) => T;
  dispatch: (action: (api: StoreApi<T>) => void) => void;
  dispatchAsync: <R>(
    asyncAction: (api: StoreApi<T>) => Promise<R>
  ) => Promise<R>;
  subscribe: (listener: Listener<T>) => Unsubscribe;
}

export interface StoreOptions<T> {
  name?: string;
  persist?:
    | string
    | {
        key: string;
        engine?: {
          getItem: (key: string) => string | null;
          setItem: (key: string, value: string) => void;
        };
        whitelist?: Array<keyof T>;
        blacklist?: Array<keyof T>;
      };
  middleware?: Array<Middleware<T>>;
}
