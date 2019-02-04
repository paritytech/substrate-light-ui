// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, MarginTop, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  basePath: string
};

export class SavedAccounts extends React.PureComponent<Props> {
  render () {
    return (
      <WalletCard
        header='Saved Accounts'
        subheader='To quickly move between accounts, select from the list of unlocked accounts below.'
        overflow='scroll'>
        <Stacked>
          <WithSpace>
            {this.renderAllAccountsFromKeyring()}
          </WithSpace>
        </Stacked>
      </WalletCard>
    );
  }

  renderAllAccountsFromKeyring () {
    return (
      <React.Fragment>
        {
          keyring.getPairs().map(pair => {
            return (
              <React.Fragment key={pair.address()}>
                <MarginTop />
                <Link to={`/identity/${pair.address()}`}>
                  <AddressSummary
                    address={pair.address()}
                    name={pair.getMeta().name}
                    orientation='horizontal'
                    size='small' />
                </Link>
              </React.Fragment>
            );
          })
        }
      </React.Fragment>
    );
  }
}
