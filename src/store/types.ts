export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] extends (infer U)[] ? DeepPartial<U>[] : T[K];
};

export type Reducer<T> = {
  (state: T): T;
};

export type ReducerWithAction<T> = {
  (state: T, action: any): T;
};

export type Action = {
  readonly payload?: unknown;
};

export type ClassOfType<T> = new (...args: any[]) => T;
