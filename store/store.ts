import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { pluck, scan, distinctUntilChanged } from 'rxjs/operators';
import { DeepPartial } from './types';

export class Store<T extends object> {

  #store: BehaviorSubject<T>;
  #stateUpdates: Subject<DeepPartial<T>>;

  constructor(initialState: T) {
    this.#store = new BehaviorSubject(initialState);
    this.#stateUpdates = new Subject();

    this.#stateUpdates
      .pipe(
        scan((acc, curr) => ({ ...acc, ...curr }), initialState)
      ).subscribe(this.#store);
  }

  selectState<
    K1 extends keyof T>
    (k1: K1): Observable<T[K1]>
  selectState<
    K1 extends keyof T,
    K2 extends keyof T[K1]>
    (k1: K1, k2: K2): Observable<T[K1][K2]>
  selectState<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]>
    (k1: K1, k2: K2, k3: K3): Observable<T[K1][K2][K3]>
  selectState<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]>
    (k1: K1, k2: K2, k3: K3, k4: K4): Observable<T[K1][K2][K3][K4]>
  selectState(...keys: string[]) {
    return this.#store
      .pipe(
        pluck(...keys),
        distinctUntilChanged()
      );
  }

  updateState(stateUpdate: DeepPartial<T>): void {
    this.#stateUpdates.next(stateUpdate);
  }

  stateChanges(): Observable<T> {
    return this.#store.asObservable();
  }
}
