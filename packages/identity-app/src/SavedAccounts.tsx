// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, MarginTop, Stacked, WalletCard, WithSpace } from '@substrate/ui-components';
import accountObservable from '@subtrate/ui-keyring/observable/accounts';
import { SingleAddress, SubjectInfo } from '@substrate/ui-keyring/observable/types';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  basePath: string
};

type State = {
  allAccounts?: SubjectInfo,
  accountsSub?: any // FIXME: rx Subscription
};

export class SavedAccounts extends React.PureComponent<Props, State> {
  state: State = {};

  componentDidMount () {
    const accountsSub = accountObservable.subject.subscribe(accounts => {
      this.setState({
        allAccounts: accounts
      });
    });

    this.setState({ accountsSub });
  }

  componentWillUnmount () {
    this.state.accountsSub.unsubscribe();
  }

  render () {
    return (
      <WalletCard
        header='Saved Accounts'
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
    const { allAccounts } = this.state;

    return allAccounts && Object.values(allAccounts).map((account: SingleAddress) => {
      return (
        <React.Fragment key={account.json.address}>
          <MarginTop />
          <Link to={`/identity/${account.json.address}`}>
            <AddressSummary
              address={account.json.address}
              name={account.json.meta.name}
              orientation='horizontal'
              size='small' />
          </Link>
        </React.Fragment>
      );
    });
  }
}
