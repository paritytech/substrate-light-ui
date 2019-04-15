// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscribe } from '@substrate/ui-common';
import { Header, WalletCard } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { SendBalance } from './SendBalance';
import { SentBalance } from './SentBalance';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export class Transfer extends React.PureComponent<Props> {
  render () {
    return (
      <WalletCard header='Transfer Balance' height='100%'>
        <Switch>
          <Route component={SentBalance} path='/transfer/:currentAccount/sent'></Route>
          <Route exact path='/transfer/:currentAccount/' render={({ match: { params: { currentAccount } } }) => (
            <Subscribe>
              {
                combineLatest(
                  accounts.subject,
                  addressObservable.subject)
                .pipe(
                  map(([accounts, addresses]) => [
                    ...Object.values(accounts).map(account => account.json.address),
                    ...Object.values(addresses).map(address => address.json.address)]),
                  map(addresses => addresses.filter(address => address !== currentAccount)),
                  map(([firstDifferentAddress, ...rest]) => {
                    return <Redirect to={`/transfer/${currentAccount}/${firstDifferentAddress || currentAccount}`} />;
                  })
                )
              }
            </Subscribe>
          )} />
          <Route component={SendBalance} path='/transfer/:currentAccount/:recipientAddress'></Route>
          <Route component={SendBalance}></Route>
        </Switch>
      </WalletCard>
    );
  }
}
