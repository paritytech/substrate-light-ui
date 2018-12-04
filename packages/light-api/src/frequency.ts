// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { Address, EventRecord } from '@polkadot/types';
import { Observable } from 'rx';
import { filter } from 'rxjs/operators';

export function onEvent (section: string, method: string, api: ApiRx): Observable<Array<EventRecord>>;
export function onEvent (section: string, method: string, args: any[], api: ApiRx): Observable<Array<EventRecord>>;
export function onEvent (section: string, method: string, arg3: any[] | ApiRx, arg4?: ApiRx) {
  const args = arg4 ? (arg3 as any[]) : [];
  const api = arg4 || (arg3 as ApiRx);

  console.log('onEvent', args);

  // FIXME Find a way to not make multiple state_storageSubscribe if we have
  // multiple onEvents.
  return api.query.system.events().pipe(
    filter(x => !!x),
    // @ts-ignore Why is TS bitching here?
    filter(({ event, phase }: EventRecord) => {
      console.log('event,phase=', event, phase);
      return phase.value && event.section === section && event.method === method;
    })
  );
}

/**
 * @description Observable that fires when an account receives units from a
 * transfer.
 * @param to - The receiving account.
 * @param api - The Api object which makes the underlying calls.
 */
export function onTransfer (to: Address, api: ApiRx) {
  // Event Transfer: "Transfer succeeded (from, to, value, fees)."
  return onEvent('balances', 'Transfer', [undefined, to], api);
}

/**
 * @description Observable that fires on each new block.
 * @param api - The Api object which makes the underlying calls.
 */
export function onNewHead (api: ApiRx) {
  return api.rpc.chain.subscribeNewHead();
}
