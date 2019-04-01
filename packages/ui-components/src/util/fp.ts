import { Functor } from 'fp-ts/lib/Functor';
import { HKT } from 'fp-ts/lib/HKT';
import { Option, some, none } from 'fp-ts/lib/Option';

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT<A> {
    Identity: Option<A>;
  }
}

export function map<F, A, B, T extends F<A>> (fn: (a: A) => B): (A: HKT<F, A>) => HKT<F, B> {
  return function (A: HKT<F, A>) {
    return A.map(fn);
  };
}

/**
 * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
 */
export function prop<P extends string> (p: P): <T>(obj: Partial<Record<P, T>>) => Option<T>;
export function prop<P extends string, T> (p: P): (obj: Partial<Record<P, T>>) => Option<T> {
  return function (obj: Partial<Record<P, T>>) {
    if (obj && p in obj) {
      return some(obj[p]!);
    }

    return none;
  };
}
