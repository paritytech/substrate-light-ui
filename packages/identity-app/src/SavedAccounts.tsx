// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { AddressSummary, BalanceDisplay, Margin, Stacked, WalletCard, WithSpace } from '@substrate/ui-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { AppContext, Subscribe } from '@substrate/ui-common';
import { map } from 'rxjs/operators';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

export class SavedAccounts extends React.PureComponent<Props> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render () {
    return (
      <WalletCard
        header='Saved Accounts'
        height='50%'
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
    const { api } = this.context;

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
                <Subscribe>
                  {
                    // FIXME using any because freeBalance gives a Codec here, not a Balance
                    // Wait for @polkadot/api to have TS support for all query.*
                    api.query.balances.freeBalance(account.json.address).pipe(map(this.renderBalance as any))
                  }
                </Subscribe>
              </React.Fragment>
            )
          ))}
      </Subscribe>
    );
  }

  renderBalance = (balance: Balance) => {
    return <BalanceDisplay balance={balance} />;
  }
}
