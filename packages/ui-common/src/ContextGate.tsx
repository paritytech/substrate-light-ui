// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx, WsProvider } from '@polkadot/api';
import { ChainProperties, Health, Text } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import settings from '@polkadot/ui-settings';
import { logger } from '@polkadot/util';
import React, { useState, useEffect } from 'react';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { AppContext, System } from './AppContext';
import { isTestChain } from './util';
import { AlertsContextProvider } from './AlertsContext';
import { StakingContextProvider } from './StakingContext';
import { TxQueueContextProvider } from './TxQueueContext';

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

const wsUrl = settings.apiUrl;

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

let keyringInitialized = false;

const l = logger('ui-common');

const api = new ApiRx(new WsProvider(wsUrl));

export function ContextGate (props: { children: React.ReactNode }) {
  const { children } = props;
  const [state, setState] = useState<State>(DISCONNECTED_STATE_PROPERTIES);
  const { isReady, system } = state;

  useEffect(() => {
    // Block the UI when disconnected
    api.isConnected.pipe(
      filter(isConnected => !isConnected)
    ).subscribe((_) => {
      setState(DISCONNECTED_STATE_PROPERTIES);
    });

    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    api.isConnected
      .pipe(
        filter(isConnected => isConnected),
        // API needs to be ready to be able to use RPCs; connected isn't enough
        switchMap(_ =>
          api.isReady
        ),
        switchMap(_ =>
          // Get info about the current chain
          // FIXME Correct types should come from @polkadot/api to avoid type assertion
          combineLatest([
            api.rpc.system.chain() as Observable<Text>,
            api.rpc.system.health() as Observable<Health>,
            api.rpc.system.name() as Observable<Text>,
            api.rpc.system.properties() as Observable<ChainProperties>,
            api.rpc.system.version() as Observable<Text>
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

        l.log(`Api connected to ${wsUrl}`);
        l.log(`Api ready, connected to chain "${chain}" with properties ${JSON.stringify(properties)}`);

        setState({
          isReady: true,
          system: {
            chain: chain.toString(),
            health,
            name: name.toString(),
            properties,
            version: version.toString()
          }
        });
      });
  }, []);

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <AppContext.Provider value={{
          api: api,
          isReady,
          keyring,
          system
        }}>
          <StakingContextProvider>
            {children}
          </StakingContextProvider>
        </AppContext.Provider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}
