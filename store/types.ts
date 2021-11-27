export type DeepPartial<T> = {
  [K in keyof T]?:
  T[K] extends object ? DeepPartial<T[K]> :
  T[K] extends (infer U)[] ? DeepPartial<U>[] :
  T[K];
};

export type Reducer<T> = {
  (state: T): T
}
