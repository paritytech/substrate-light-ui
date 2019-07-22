// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, StyledNavButton, Stacked, Table } from '@substrate/ui-components';
import BN from 'bn.js';
import { fromNullable, some } from 'fp-ts/lib/Option';
import localforage from 'localforage';
import React, { useContext, useEffect, useState } from 'react';
import { Subscription, Observable } from 'rxjs';
import { Loader } from 'semantic-ui-react';

import { OfflineStatus } from '../types';

interface Props {
  offlineStatuses?: OfflineStatus[];
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { offlineStatuses, validator } = props;
  const { api, keyring } = useContext(AppContext);
  const [nominations, setNominations] = useState<[AccountId, Balance][]>();
  const [offlineTotal, setOfflineTotal] = useState<BN>(new BN(0));

  useEffect(() => {
    const subscription: Subscription = (api.derive.staking.info(validator.toString()) as unknown as Observable<DerivedStaking>)
      .subscribe((derivedStaking: DerivedStaking) => {
        const { stakers } = derivedStaking;
        const nominations = stakers ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value]) : [];

        setNominations(nominations);
      });

    fromNullable(offlineStatuses)
      .map(offlineStatuses => offlineStatuses.reduce((total, { count }) => total.add(count), new BN(0)))
      .map(setOfflineTotal)
      .getOrElse(undefined);

    return () => subscription.unsubscribe();
  }, []);
  return (
    <Table.Row>
      <Table.Cell width='6'>
        <AddressSummary
          address={validator.toString()}
          orientation='horizontal'
          name={fromNullable(keyring.getAccount(validator.toString()))
                  .chain(account => some(account.meta))
                  .chain(meta => some(meta.name))
                  .getOrElse(undefined)}
          noPlaceholderName
          size='medium' />
      </Table.Cell>
      <Table.Cell textAlign='center' width='2'>{offlineTotal.toString()}</Table.Cell>
      <Table.Cell collapsing width='5'>
        {
          nominations
            ? nominations.map(([who, bonded]) => (
              <Stacked>
                <AddressSummary address={who.toString()} orientation='horizontal' noPlaceholderName size='tiny' />
                <FadedText>Bonded Amount: {bonded.toString()}</FadedText>
              </Stacked>)
              )
            : <Loader active inline />
        }
      </Table.Cell>
      <Table.Cell width='3'>
        <StyledNavButton> Nominate </StyledNavButton>
      </Table.Cell>
    </Table.Row>
  );
}
