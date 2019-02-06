// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainProperties } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import * as React from 'react';
import { zip } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { ApiContext } from './ApiContext';

interface State {
  isReady: boolean;
}

export class ApiGate extends React.PureComponent {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state = { isReady: false } as State;

  componentDidMount () {
    const { api } = this.context;

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

      console.log('ISREADY');
      this.setState({ isReady: true });
    });
  }

  render () {
    const { children } = this.props;
    const { isReady } = this.state;

    // FIXME Return a nicer component when loading
    return isReady ? children : <div>Loading...</div>;
  }
}
