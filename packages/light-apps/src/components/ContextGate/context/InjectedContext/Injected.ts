// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import InjectedBase from '@polkadot/extension-base/page/Injected';
import { SendRequest } from '@polkadot/extension-base/page/types';

/**
 * Same as parent, but we export the `sendMessage` function, so that other
 * people can use it too.
 */
export class Injected extends InjectedBase {
  public sendMessage: SendRequest;

  constructor(sendMessage: SendRequest) {
    super(sendMessage);
    this.sendMessage = sendMessage;
  }
}
