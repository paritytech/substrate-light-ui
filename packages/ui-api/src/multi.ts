// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// https://github.com/acdlite/recompose/issues/748#issuecomment-429857497
import 'symbol-observable';

import { compose, mapPropsStreamWithConfig } from 'recompose';
import { combineLatest, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type RxFn<T> = (...args: any[]) => Observable<T>;

interface RxFnMap {
  [index: string]: RxFn<any>;
}

/**
 * HOC which listens to one Observable, and update the React wrapped component
 * every time the Observable fires.
 *
 * @param key - The key to add the value in `this.props`, so that the value
 * will be accessible via `this.props[key]`.
 * @param rxFn - Function which returns an Observable, which the HOC listens
 * to.
 */
export const withOneObservable = <OwnProps, T>(
  key: string,
  rxFn: RxFn<T>
) =>
  mapPropsStreamWithConfig({
    // Converts a plain ES observable to an RxJS 6 observable
    fromESObservable: from,
    toESObservable: stream$ => stream$
  })(props$ =>
    combineLatest(
      props$,
      (props$ as Observable<OwnProps>).pipe(switchMap(rxFn))
    ).pipe(
      map(([props, value]) => ({ ...props, [key]: value }))
    )
  );

/**
 * HOC which listens to multiple Observables, and injects those emitted values
 * into `this.props`.
 *
 * @param observables - An object where the keys will be injected into
 * `this.props`, and the value of each key will be the value emitted by the
 * corresponding Observable.
 */
export const withMultiObservables = (observables: RxFnMap) =>
  compose(
    ...Object.keys(observables).map(key =>
      withOneObservable(key, observables[key])
    )
  );
