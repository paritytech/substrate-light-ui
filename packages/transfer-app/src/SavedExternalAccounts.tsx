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

export class SavedExternalAccounts extends React.PureComponent<Props> {
  componentWillMount () {
    // FIXME: Only load keyring once after light-api is set
    try {
      keyring.loadAll();
    } catch (e) {
      console.log(e);
    }
  }

  render () {
    return (
      <WalletCard
        header='External Accounts'
        overflow='scroll'
        subheader='Quickly select an external account you have previously saved to transfer balance to'>
        <Stacked>
          <WithSpace>
              { this.renderAllExternalAccountsFromKeyring() }
          </WithSpace>
        </Stacked>
      </WalletCard>
    );
  }

  renderAllExternalAccountsFromKeyring () {
    return (
      <React.Fragment>
        {
          keyring.getPairs().filter(pair => pair.getMeta().isExternal).map(pair => {
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
          });
        }
      </React.Fragment>
    );
  }
}
