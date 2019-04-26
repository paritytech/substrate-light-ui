// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscribe, TxQueueContext } from '@substrate/ui-common';
import { Container, Header } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function Transfer (props: Props) {

  const { txQueue } = useContext(TxQueueContext);

  return (
    <Container>
      <Header>Transfer Balance</Header>

      <Switch>
        <Route exact path='/transfer/:currentAccount/' render={({ match: { params: { currentAccount } } }) => (
          <Subscribe>
            {
              combineLatest(
                accounts.subject,
                addressObservable.subject
              )
                .pipe(
                  map(([accounts, addresses]) => [
                    ...Object.values(accounts).map(account => account.json.address),
                    ...Object.values(addresses).map(address => address.json.address)]),
                  map(addresses => addresses.filter(address => address !== currentAccount)),
                  map(([firstDifferentAddress, ...rest]) => (
                    <Redirect to={`/transfer/${currentAccount}/${firstDifferentAddress || currentAccount}`} />
                  ))
                )
            }
          </Subscribe>
        )} />
        {txQueue.length
          ? <Route path='/transfer/:currentAccount/:recipientAddress' component={TxQueue} />
          : <Route path='/transfer/:currentAccount/:recipientAddress' component={SendBalance} />
        }
      </Switch>
    </Container>
  );
}
