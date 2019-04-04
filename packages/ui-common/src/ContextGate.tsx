// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ChainProperties } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import React from 'react';
import { Observable, zip } from 'rxjs';

import { initStore } from './Alerts';
import { AppContext } from './AppContext';
import { isTestChain } from './util';

interface System {
  chain: any;
  properties: any;
}

interface State {
  isReady: boolean;
  system: System;
}

interface Props {
  loadingComponent: React.ReactNode;
}

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

export class ContextGate extends React.PureComponent<Props> {
  alerts = initStore();

  api = new ApiRx();

  state: State = {
    isReady: false,
    system: {
      get chain () {
        throw INIT_ERROR;
      },
      get properties () {
        throw INIT_ERROR;
      }
    }
  };

  componentDidMount () {
    // Get info about the current chain
    zip(
      this.api.isReady,
      (this.api.rpc.system.chain()),
      // FIXME Correct types should come from @polkadot/api to avoid type assertion
      (this.api.rpc.system.properties() as Observable<ChainProperties>)
    )
      .subscribe(([_, chain, properties]) => {
        const networkId = properties.get('networkId') || 42;

        // keyring with Schnorrkel support
        keyring.loadAll({
          addressPrefix: networkId,
          isDevelopment: isTestChain(chain.toString()),
          type: 'ed25519'
        });

        this.setState(state => ({
          ...state,
          isReady: true,
          system: {
            chain,
            properties
          }
        }));
      });
  }

  render () {
    const { children } = this.props;
    const { isReady, system } = this.state;

    console.log('system', system);

    return <AppContext.Provider value={{
      alerts: this.alerts,
      api: this.api,
      isReady,
      keyring,
      system
    }}>
      {children}
    </AppContext.Provider>;
  }
}
