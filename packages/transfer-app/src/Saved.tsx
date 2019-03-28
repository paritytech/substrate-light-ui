// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Balance } from '@polkadot/types';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { ApiContext, Subscribe } from '@substrate/ui-api';
import { AddressSummary, BalanceDisplay, Grid, Margin, NavLink, Stacked, StackedHorizontal, SubHeader, WalletCard, WithSpace } from '@substrate/ui-components';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {
}

export class Saved extends React.PureComponent<Props> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  render () {
    return (
      <WalletCard
        header='Saved Identities'
        overflow='scroll'
        subheader='Quickly select an identity that you have previously saved to transfer balance to'>
        <Margin top='huge' />
        <Grid>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> My Unlocked Accounts </SubHeader>
              <WithSpace>
                {this.renderMyAccounts()}
              </WithSpace>
            </Stacked>
          </Grid.Column>
          <Grid.Column width={8}>
            <Stacked justify='flex-start'>
              <SubHeader> Saved Addresses </SubHeader>
              <WithSpace>
                {this.renderMyAddresses()}
              </WithSpace>
            </Stacked>
          </Grid.Column>
        </Grid>
      </WalletCard>
    );
  }

  renderMyAccounts () {
    const { api } = this.context;
    const { match: { params: { currentAddress } } } = this.props;

    return (
      <Subscribe>
        {accountObservable.subject.pipe(
          map((allAccounts: SubjectInfo) =>
            !allAccounts
              ? this.renderEmpty()
              : Object.values(allAccounts).map((account: SingleAddress) =>
                <React.Fragment key={account.json.address}>
                  <Margin top />
                  <AddressSummary
                    address={account.json.address}
                    name={
                      <Link to={{
                        pathname: `/transfer/${currentAddress}`,
                        state: {
                          recipientAddress: account.json.address
                        }
                      }}>
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

  renderMyAddresses () {
    const { api } = this.context;
    const { match: { params: { currentAddress } } } = this.props;

    return (
      <Subscribe>
        {addressObservable.subject.pipe(
          map((allAddresses: SubjectInfo) =>
            !Object.keys(allAddresses).length
              ? this.renderEmpty()
              : Object.values(allAddresses).map((address: SingleAddress) =>
                <React.Fragment key={`__locked_${address.json.address}`}>
                  <Margin top />
                  <StackedHorizontal>
                    <Link to={{
                      pathname: `/transfer/${currentAddress}`,
                      state: {
                        recipientAddress: address.json.address
                      }
                    }}>
                      <AddressSummary
                        address={address.json.address}
                        data-address={address.json.address} // Trick to avoid creating a new React component
                        name={address.json.meta.name}
                        orientation='horizontal'
                        size='small' />
                    </Link>
                    <Subscribe>
                      {
                        // FIXME using any because freeBalance gives a Codec here, not a Balance
                        // Wait for @polkadot/api to have TS support for all query.*
                        api.query.balances.freeBalance(address.json.address).pipe(map(this.renderBalance as any))
                      }
                    </Subscribe>
                  </StackedHorizontal>
                </React.Fragment>
              )
          ))}
      </Subscribe>
    );
  }

  renderBalance = (balance: Balance) => {
    return (
      <BalanceDisplay balance={balance} />
    );
  }

  renderEmpty () {
    const { match: { params: { currentAddress } } } = this.props;

    return (
      <React.Fragment>
        <p> It looks like you don't have any saved accounts. You can add them from your address book in Identity app. </p>
        <NavLink to={`/identity/${currentAddress}`}> Take me there </NavLink>
      </React.Fragment>
    );
  }
}
