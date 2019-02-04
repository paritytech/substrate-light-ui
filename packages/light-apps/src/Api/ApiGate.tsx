// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainProperties } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import * as React from 'react';
import { zip } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { ApiContext, ApiContextType } from './ApiContext';

interface State {
  networkId?: number;
}

export class ApiGate extends React.PureComponent {
  static contextType = ApiContext;

  state = {} as State;

  componentDidMount () {
    const { api } = this.context as ApiContextType;

    // Get info about the current chain
    zip(
      api.isReady,
      api.rpc.system.properties()
    ).pipe(
      map(([_, properties]) => properties as ChainProperties),
      first()
    ).subscribe((properties) => {
      const networkId = properties.get('networkId') || 42;

      // Setup keyring (loadAll) only after prefix has been set
      keyring.setAddressPrefix(networkId);
      keyring.loadAll();

      // I have some race condition when using keyring.getPairs right after
      // keyring,.getAll(). Adding a 500ms delay here.
      this.setState({ networkId });
    });
  }

  render () {
    const { children } = this.props;
    const { networkId } = this.state;

    // FIXME Return a nicer component when loading
    return networkId ? children : <div>Loading...</div>;
  }
}
