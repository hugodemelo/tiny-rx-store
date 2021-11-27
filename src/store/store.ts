import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  pluck,
  distinctUntilChanged,
  withLatestFrom,
  map,
} from 'rxjs/operators';
import { Reducer } from './types';

export class Store<T extends object> {
  private readonly store: BehaviorSubject<T>;
  private readonly stateUpdates: Subject<Reducer<T>>;

  constructor(initialState: T) {
    this.store = new BehaviorSubject(initialState);
    this.stateUpdates = new Subject();

    this.stateUpdates
      .pipe(
        withLatestFrom(this.store),
        map(([reducer, state]) => reducer(state))
      )
      .subscribe(this.store);
  }

  selectStateByKey<K1 extends keyof T>(k1: K1): Observable<T[K1]>;
  selectStateByKey<
    K1 extends keyof T,
    K2 extends keyof T[K1]
  >(k1: K1, k2: K2): Observable<T[K1][K2]>;
  selectStateByKey<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(k1: K1, k2: K2, k3: K3): Observable<T[K1][K2][K3]>;
  selectStateByKey<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(k1: K1, k2: K2, k3: K3, k4: K4): Observable<T[K1][K2][K3][K4]>;
  selectStateByKey<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Observable<T[K1][K2][K3][K4][K5]>;
  selectStateByKey(...keys: string[]) {
    return this.store.pipe(pluck(...keys), distinctUntilChanged());
  }

  selectState<U>(mapFunc: (state: T) => U): Observable<U> {
    return this.store.pipe(map(mapFunc));
  }

  updateState(reducer: Reducer<T>): void {
    this.stateUpdates.next(reducer);
  }

  stateChanges(): Observable<T> {
    return this.store.asObservable();
  }
}
