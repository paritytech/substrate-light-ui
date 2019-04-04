// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ChainProperties, Text } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { logger } from '@polkadot/util';
import React from 'react';
import { Observable, zip } from 'rxjs';

import { alertStore } from './alerts';
import { AppContext, System } from './AppContext';
import { isTestChain } from './util';

interface State {
  isReady: boolean;
  system: System;
}

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

const l = logger('ui-common');

export class ContextGate extends React.PureComponent<{}, State> {
  alertStore = alertStore();

  api = new ApiRx();

  state: State = {
    isReady: false,
    system: {
      get chain (): never {
        throw INIT_ERROR;
      },
      get properties (): never {
        throw INIT_ERROR;
      }
    }
  };

  componentDidMount () {
    // Get info about the current chain
    zip(
      this.api.isReady,
      (this.api.rpc.system.chain() as Observable<Text>),
      // FIXME Correct types should come from @polkadot/api to avoid type assertion
      (this.api.rpc.system.properties() as Observable<ChainProperties>)
    )
      .subscribe(([_, chain, properties]) => {
        // keyring with Schnorrkel support
        keyring.loadAll({
          addressPrefix: properties.get('networkId'),
          isDevelopment: isTestChain(chain.toString()),
          type: 'ed25519'
        });

        l.log(`Api ready, connected to chain "${chain}" with properties ${JSON.stringify(properties)}`);

        this.setState(state => ({
          ...state,
          isReady: true,
          system: {
            chain: chain.toString(),
            properties
          }
        }));
      });
  }

  render () {
    const { children } = this.props;
    const { isReady, system } = this.state;

    return <AppContext.Provider value={{
      alertStore: this.alertStore,
      api: this.api,
      isReady,
      keyring,
      system
    }}>
      {children}
    </AppContext.Provider>;
  }
}
