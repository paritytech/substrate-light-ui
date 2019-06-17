// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { Grid } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountsOverviewCard } from './AccountsOverviewCard';

interface IProps extends RouteComponentProps {
  limit?: number;
}

export function AccountsOverview (props: IProps) {
  const { history, limit } = props;
  const [allUnlockedAccounts, setAllUnlocked] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const accountsSub =
      (accountObservable.subject.pipe(map(Object.values)) as Observable<SingleAddress[]>)
        .subscribe(setAllUnlocked);

    return () => accountsSub.unsubscribe();
  }, []);

  const renderAccountCard = (address: string, name?: string) => {
    return (
      <Grid.Column width='4'>
        <AccountsOverviewCard address={address} name={name} history={history} />
      </Grid.Column>
    );
  };

  return (
    <Grid>
      <Grid.Row>
       {
        allUnlockedAccounts.slice(0, limit || allUnlockedAccounts.length).map((account) => {
          return renderAccountCard(account.json.address, account.json.meta.name);
        })
       }
      </Grid.Row>
    </Grid>
  );
}
