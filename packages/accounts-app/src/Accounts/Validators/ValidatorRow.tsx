// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Table, StyledNavButton } from '@substrate/ui-components';
import BN from 'bn.js';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Subscription, Observable } from 'rxjs';
import { Loader } from 'semantic-ui-react';

import { OfflineStatus } from '../types';
import { DerivedStaking } from '@polkadot/api-derive/types';

interface Props {
  offlineStatuses?: OfflineStatus[];
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { offlineStatuses, validator } = props;
  const { api, keyring } = useContext(AppContext);
  const [nominations, setNominations] = useState<[AccountId, Balance][]>([]);
  const [offlineTotal, setOfflineTotal] = useState<BN>(new BN(0));

  useEffect(() => {
    const subscription: Subscription = (api.derive.staking.info(validator.toString()) as unknown as Observable<DerivedStaking>)
      .subscribe((derivedStaking: DerivedStaking) => {
        const { stakers } = derivedStaking;
        const nominations = stakers ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value]) : [];

        setNominations(nominations);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fromNullable(offlineStatuses)
      .map(offlineStatuses => setOfflineTotal(offlineStatuses.reduce((total, { count }) => total.add(count), new BN(0))))
      .getOrElse(undefined);
  }, []);

  return (
      <Table.Row>
        <Table.Cell>
          <AddressSummary
            address={validator.toString()}
            orientation='horizontal'
            name={fromNullable(keyring.getAccount(validator.toString()))
                    .chain(account => some(account.meta))
                    .chain(meta => some(meta.name))
                    .getOrElse(undefined)}
            size='medium' />
        </Table.Cell>
        <Table.Cell>{offlineTotal.toString()}</Table.Cell>
        <Table.Cell>
          {
            nominations
              ? nominations.map(([who, bonded]) => <div>{who}-- {bonded}</div>)
              : <Loader active inline />
          }
        </Table.Cell>
        <Table.Cell>
          <StyledNavButton> Nominate </StyledNavButton>
        </Table.Cell>
      </Table.Row>
  );
}
