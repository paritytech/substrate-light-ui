// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx, WsProvider } from '@polkadot/api';
import { ChainProperties, Health, Text } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import settings from '@polkadot/ui-settings';
import { logger } from '@polkadot/util';
import React from 'react';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { AppContext, System } from './AppContext';
import { isTestChain } from './util';
import { AlertsContextProvider } from './AlertsContext';
import { TxQueueContextProvider } from './TxQueueContext';

// Holds the state for all the contexts
interface State {
  isReady: boolean;
  system: System;
}

const DISCONNECTED_STATE_PROPERTIES = {
  isReady: false,
  system: {
    get chain (): never {
      throw INIT_ERROR;
    },
    get health (): never {
      throw INIT_ERROR;
    },
    get name (): never {
      throw INIT_ERROR;
    },
    get properties (): never {
      throw INIT_ERROR;
    },
    get version (): never {
      throw INIT_ERROR;
    }
  }
};

const url = process.env.WS_URL || settings.apiUrl || undefined;

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

let keyringInitialized = false;

const l = logger('ui-common');

// The reasons why we regroup all contexts in one big context is:
// 1. I don't like the render props syntax with the context consumer. -Amaury
// 2. We want to access Context in lifecycle methods like componentDidMount.
// It's either adding a wrapper and passing as props, like:
// https://github.com/facebook/react/issues/12397#issuecomment-375501574
// or use one context for everything:
// https://github.com/facebook/react/issues/12397#issuecomment-462142714
// FIXME we could probably split this out into small modular contexts once we
// use https://reactjs.org/docs/hooks-reference.html#usecontext
export class ContextGate extends React.PureComponent<{}, State> {
  api = new ApiRx(url ? new WsProvider(url) : undefined);

  state: State = {
    ...DISCONNECTED_STATE_PROPERTIES
  };

  componentDidMount () {
    // Block the UI when disconnected
    this.api.isConnected.pipe(
      filter(isConnected => !isConnected)
    ).subscribe((_) => {
      this.setState(DISCONNECTED_STATE_PROPERTIES);
    });

    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    this.api.isConnected
      .pipe(
        filter(isConnected => isConnected),
        // API needs to be ready to be able to use RPCs; connected isn't enough
        switchMap(_ =>
          this.api.isReady
        ),
        switchMap(_ =>
          // Get info about the current chain
          // FIXME Correct types should come from @polkadot/api to avoid type assertion
          combineLatest([
            this.api.rpc.system.chain() as Observable<Text>,
            this.api.rpc.system.health() as Observable<Health>,
            this.api.rpc.system.name() as Observable<Text>,
            this.api.rpc.system.properties() as Observable<ChainProperties>,
            this.api.rpc.system.version() as Observable<Text>
          ])
        )
      )
      .subscribe(([chain, health, name, properties, version]) => {
        if (!keyringInitialized) {
          // keyring with Schnorrkel support
          keyring.loadAll({
            addressPrefix: properties.get('networkId'),
            isDevelopment: isTestChain(chain.toString()),
            type: 'ed25519'
          });
          keyringInitialized = true;
        } else {
          // The keyring can only be initialized once. To make sure that the
          // keyring values are up-to-date in case the node has changed settings
          // we need to reinitialize it.
          window.location.reload();
          return;
        }

        l.log(`Api ready, connected to chain "${chain}" with properties ${JSON.stringify(properties)}`);

        this.setState(state => ({
          ...state,
          isReady: true,
          system: {
            chain: chain.toString(),
            health,
            name: name.toString(),
            properties,
            version: version.toString()
          }
        }));
      });
  }

  // set a new WS endpoint and re-mount the app.
  setUrl = (url: string) => {
    const provider = new WsProvider(url);
    this.api = new ApiRx(provider);
    
    console.log('setting to: ', url);
    console.log('new provider: ', provider);
  }

  render () {
    const { children } = this.props;
    const { isReady, system } = this.state;

    return (
      <AlertsContextProvider>
        <TxQueueContextProvider>
          <AppContext.Provider value={{
            api: this.api,
            isReady,
            keyring,
            setUrl: this.setUrl,
            system
          }}>
            {children}
          </AppContext.Provider>
        </TxQueueContextProvider>
      </AlertsContextProvider>
    );
  }
}
