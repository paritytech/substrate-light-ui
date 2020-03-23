// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  createSubscription,
  unsubscribe,
} from '../../polkadotjs/background/handlers/subscriptions';
import TabsBase from '../../polkadotjs/background/handlers/Tabs';
import {
  MessageTypes as MessageTypesBase,
  ResponseTypes,
} from '../../polkadotjs/background/types';
import { MessageTypes, RequestTypes, SubscriptionMessageTypes } from '../types';
import { State } from './State';

export class Tabs extends TabsBase {
  constructor(state: State) {
    super(state);
  }

  // FIXME add to extension-base
  protected get state(): State {
    return super.state;
  }

  private rpcSubscribeConnected(
    _request: null,
    id: string,
    port: chrome.runtime.Port
  ): Promise<boolean> {
    const innerCb = createSubscription<'pub(rpc.subscribeConnected)'>(id, port);
    const cb = (
      _error: Error | null,
      data: SubscriptionMessageTypes['pub(rpc.subscribeConnected)']
    ): void => innerCb(data);
    const isConnected = this.state.rpcSubscribeConnected(null, cb, port);

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
    });

    return Promise.resolve(isConnected);
  }

  public async handle<TMessageType extends MessageTypes>(
    id: string,
    type: TMessageType,
    request: RequestTypes[TMessageType],
    url: string,
    port: chrome.runtime.Port
  ): Promise<ResponseTypes[keyof ResponseTypes]> {
    if (type !== 'pub(authorize.tab)') {
      this.state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'pub(rpc.subscribeConnected)':
        return this.rpcSubscribeConnected(null, id, port);
      default:
        return super.handle(id, type as MessageTypesBase, request, url, port);
    }
  }
}
