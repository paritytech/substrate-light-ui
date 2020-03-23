// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterfaceCallback } from '@polkadot/rpc-provider/types';
import { assert } from '@polkadot/util';

import StateBase from '../../polkadotjs/background/handlers/State';
import { RequestAuthorizeTab } from '../../polkadotjs/background/types';

export class State extends StateBase {
  // FIXME Same as parent, use protected
  private myStripUrl(url: string): string {
    assert(
      url && (url.startsWith('http:') || url.startsWith('https:')),
      `Invalid url ${url}, expected to start with http: or https:`
    );

    const parts = url.split('/');

    return parts[2];
  }

  /**
   * Same as parent, but allow localhost:3000
   */
  public async authorizeUrl(
    url: string,
    request: RequestAuthorizeTab
  ): Promise<boolean> {
    const stripped = this.myStripUrl(url);

    // FIXME do this while we don't have an auth page in the UI
    if (stripped === 'localhost:3000') {
      return true;
    }

    return super.authorizeUrl(url, request);
  }

  /**
   * Same as parent, but allow localhost:3000
   */
  public ensureUrlAuthorized(url: string): boolean {
    const stripped = this.myStripUrl(url);

    // FIXME do this while we don't have an auth page in the UI
    if (stripped === 'localhost:3000') {
      return true;
    }

    return super.ensureUrlAuthorized(url);
  }

  /**
   * Subscribe to whether the provider is connected or not.
   */
  public rpcSubscribeConnected(
    _request: null,
    cb: ProviderInterfaceCallback,
    port: chrome.runtime.Port
  ): boolean {
    const provider = this.injectedProviders.get(port);

    assert(
      provider,
      'Cannot call pub(rpc.subscribeConnected) before provider has been set'
    );

    provider.on('connected', () => cb(null, true));
    provider.on('disconnected', () => cb(null, false));

    return provider.isConnected();
  }
}
