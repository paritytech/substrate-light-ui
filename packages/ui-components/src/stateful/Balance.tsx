// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { AppContext, Subscribe } from '@substrate/ui-common';
import React from 'react';
import { map } from 'rxjs/operators';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address?: string;
}

const ZERO_BALANCE = new BalanceType(0);

export class Balance extends React.PureComponent<BalanceProps> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render () {
    const { api, system: { properties } } = this.context;
    const { address, ...rest } = this.props;

    if (!address) {
      return <BalanceDisplay balance={ZERO_BALANCE} tokenSymbol={properties.tokenSymbol} {...rest} />;
    }

    return (
      <Subscribe>
        {
          // FIXME using any because freeBalance gives a Codec here, not a Balance
          // Wait for @polkadot/api to have TS support for all query.*
          api.query.balances.freeBalance(address).pipe(map(this.renderBalance as any))
        }
      </Subscribe>
    );
  }

  renderBalance = (balance: BalanceType) => {
    const { system: { properties } } = this.context;
    const { address, ...rest } = this.props;

    return <BalanceDisplay balance={balance} tokenSymbol={properties.tokenSymbol} {...rest} />;
  }
}
