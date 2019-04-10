// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Margin, Stacked, WalletCard, WithSpace } from '@substrate/ui-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Subscribe } from '@substrate/ui-common';
import { map } from 'rxjs/operators';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

export class SavedAccounts extends React.PureComponent<Props> {
  render () {
    return (
      <WalletCard
        header='Saved Accounts'
        height='100%'
        overflow='scroll'
        subheader='To quickly move between accounts, select from the list of unlocked accounts below.'>
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
      <Subscribe>
        {accountObservable.subject.pipe(
          map((allAccounts: SubjectInfo) =>
            Object.values(allAccounts).map((account: SingleAddress) =>
              <React.Fragment key={account.json.address}>
                <Margin top />
                <AddressSummary
                  address={account.json.address}
                  name={
                    <Link to={`/identity/${account.json.address}/edit`}>
                      {account.json.meta.name}
                    </Link>
                  }
                  orientation='horizontal'
                  size='small'
                />
              </React.Fragment>
            )
          ))}
      </Subscribe>
    );
  }
}
