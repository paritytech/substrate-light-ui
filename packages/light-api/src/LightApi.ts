// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import WsProvider from '@polkadot/rpc-provider/ws';

import * as functions from './functions';

interface LightFunctions {
  [index: string]: any; // TODO Better types here
}

export class LightApi extends ApiRx {
  public light: LightFunctions;

  constructor (wsProvider?: WsProvider) {
    super(wsProvider);

    this.light = Object.keys(functions).reduce(
      (result, key) => {
        // @ts-ignore
        result[key] = (...args: any[]) => functions[key](...args, this);

        return result;
      },
      {} as LightFunctions
    );
  }
}
