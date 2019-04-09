// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ChainProperties, Health, Text } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { logger } from '@polkadot/util';
import React from 'react';
import { Observable, zip } from 'rxjs';

import { Alert, AlertStore, AlertWithoutId, dequeue, enqueue } from './alerts';
import { AppContext, Chain, System } from './AppContext';
import { isTestChain } from './util';

// Holds the state for all the contexts
interface State {
  alertStore: AlertStore;
  isReady: boolean;
  system: System;
}

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

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
  /**
   * Hold an internal counter of alerts, see:
   * https://github.com/paritytech/substrate-light-ui/pull/253#discussion_r272556331
   */
  alertStoreCount = 0;

  api = new ApiRx();

  state: State = {
    alertStore: this.alertStoreCreate([]),
    isReady: false,
    system: {
      get chain (): never {
        throw INIT_ERROR;
      },
      get health (): never {
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
      (this.api.rpc.system.health() as Observable<Health>),
      // FIXME Correct types should come from @polkadot/api to avoid type assertion
      (this.api.rpc.system.properties() as Observable<ChainProperties>)
    )
      .subscribe(([_, chain, health, properties]) => {
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
            health,
            properties
          }
        }));
      });
  }

  alertStoreCreate (alerts: Alert[]): AlertStore {
    return {
      alerts,
      dequeue: () => this.alertStoreDequeue(),
      enqueue: (newItem: Alert) => this.alertStoreEnqueue(newItem)
    };
  }

  alertStoreDequeue = () => {
    this.setState((state) => ({
      ...state,
      alertStore: this.alertStoreCreate(dequeue(state.alertStore.alerts))
    }));
  }

  alertStoreEnqueue = (newItem: AlertWithoutId) => {
    ++this.alertStoreCount;

    this.setState((state) => ({
      ...state,
      alertStore: this.alertStoreCreate(enqueue(state.alertStore.alerts, {
        ...newItem,
        id: this.alertStoreCount
      }))
    }));
  }

  render () {
    const { children } = this.props;
    const { alertStore, isReady, system } = this.state;

    return <AppContext.Provider value={{
      alertStore,
      api: this.api,
      isReady,
      keyring,
      system
    }}>
      {children}
    </AppContext.Provider>;
  }
}
