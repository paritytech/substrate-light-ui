// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { PendingExtrinsic, TxQueueContext } from '@substrate/ui-common';
import { WalletCard } from '@substrate/ui-components';
import { findFirst, flatten } from 'fp-ts/lib/Array';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountsOverview } from '@substrate/accounts-app';
import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function Transfer (props: Props) {
  const { match: { params: { currentAccount } } } = props;
  const { txQueue } = useContext(TxQueueContext);
  const [allAddresses, setAllAddresses] = useState<SingleAddress[]>([]);
  useEffect(() => {
    const allAddressessub = combineLatest([
      accountObservable.subject.pipe(map(Object.values)) as Observable<SingleAddress[]>,
      addressObservable.subject.pipe(map(Object.values)) as Observable<SingleAddress[]>
    ])
      .pipe(map(flatten))
      .subscribe(setAllAddresses);

    return () => allAddressessub.unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <AccountsOverview {...props} />
      <WalletCard header='Transfer Balance' height='100%'>
        {allAddresses.length && renderContent(allAddresses, currentAccount, txQueue)}
      </WalletCard >
    </React.Fragment>
  );
}

function renderContent (
  allAddresses: SingleAddress[],
  currentAccount: string,
  txQueue: PendingExtrinsic[]
) {
  // Find, inside `allAddresses`, the first one that's different than
  // currentAccount. If not found, then take currentAccount
  const firstDifferentAddress = findFirst(
    allAddresses,
    ({ json: { address } }) => address !== currentAccount
  )
    .map(({ json: { address } }) => address)
    .getOrElse(currentAccount);

  return (
    <Switch>
      {txQueue.length
        ? <Route path='/transfer/:currentAccount/:recipientAddress' component={TxQueue} />
        : <Route path='/transfer/:currentAccount/:recipientAddress' component={SendBalance} />
      }
      <Redirect exact from='/transfer/:currentAccount/' to={`/transfer/${currentAccount}/${firstDifferentAddress}`} />
    </Switch>
  );
}
