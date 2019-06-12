// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { AddressSummary, Card, FlexItem, StackedHorizontal, WithSpaceAround } from '@substrate/ui-components';
// import { AppContext } from '@substrate/ui-common';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Props extends RouteComponentProps {}

export function Accounts (props: Props) {
  const [allUnlockedAccounts, setAllUnlocked] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const accountsSub =
      (accountObservable.subject.pipe(map(Object.values)) as Observable<SingleAddress[]>)
      .subscribe(setAllUnlocked);

    return () => accountsSub.unsubscribe();
  }, []);

  const renderAccountCard = (account: SingleAddress) => {
    return (
      <Card height='12rem'>
        <WithSpaceAround>
          <StackedHorizontal>
            <FlexItem><AddressSummary address={account.json.address} name={account.json.meta.name} orientation='horizontal' size='medium' /></FlexItem>
            <FlexItem> other information goes here</FlexItem>
          </StackedHorizontal>
        </WithSpaceAround>
      </Card>
    );
  };

  return (
    <React.Fragment>
      {
        allUnlockedAccounts.map((account: SingleAddress) => (
          renderAccountCard(account)
        ))
      }
    </React.Fragment>
  );
}
