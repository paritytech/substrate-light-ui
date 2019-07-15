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

interface IProps extends RouteComponentProps { }

export function AccountsOverview (props: IProps) {
  const { history } = props;
  const [allUnlockedAccounts, setAllUnlocked] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const accountsSub =
      (accountObservable.subject.pipe(map(Object.values)) as Observable<SingleAddress[]>)
        .subscribe(setAllUnlocked);

    return () => accountsSub.unsubscribe();
  }, []);

  return (
    <Grid columns={16}>
       {
          allUnlockedAccounts.map((account) => {
            return (
              <Grid.Column key={account.json.address} stretched width='4'>
                <AccountsOverviewCard address={account.json.address} name={account.json.meta.name} history={history} />
              </Grid.Column>
            );
          })
       }
    </Grid>
  );
}
