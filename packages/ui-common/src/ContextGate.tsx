// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Loading } from '@substrate/ui-components';
import ApiRx from '@polkadot/api/rx';
import { ChainProperties } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import React from 'react';
import { Observable, zip } from 'rxjs';

import { Context } from './Context';
import { isTestChain } from './util';

interface State {
  isReady: boolean;
}

interface Props {
  loadingComponent: React.ReactNode;
}

export class ContextGate extends React.PureComponent<Props> {
  private api = new ApiRx();

  state = { isReady: false } as State;

  componentDidMount () {
    // Get info about the current chain
    zip(
      this.api.isReady,
      (this.api.rpc.system.chain()),
      // FIXME Correct types should come from @polkadot/api to avoid type assertion
      (this.api.rpc.system.properties() as unknown as Observable<ChainProperties>)
    )
      .subscribe(([_, chain, properties]) => {
        const networkId = properties.get('networkId') || 42;

        // keyring with Schnorrkel support
        keyring.loadAll({
          addressPrefix: networkId,
          isDevelopment: isTestChain(chain.toString()),
          type: 'ed25519'
        });

        this.setState({ isReady: true });
      });
  }

  render () {
    const { children } = this.props;
    const { isReady } = this.state;

    return isReady
      ? <Context.Provider value={{ api: this.api, keyring }}>{children}</Context.Provider>
      : <Loading active />;
  }
}
