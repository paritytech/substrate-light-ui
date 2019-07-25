// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Exposure, Option, StakingLedger } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, Stacked, Table, Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import H from 'history';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { Loader } from 'semantic-ui-react';

import { OfflineStatus } from '../Accounts/types';
import { ConfirmNominationDialog } from './ConfirmNominationDialog';

interface Props {
  history: H.History;
  offlineStatuses?: OfflineStatus[];
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { offlineStatuses, validator } = props;
  const { api, keyring } = useContext(AppContext);
  const [nominations, setNominations] = useState<[AccountId, Balance][]>([]);
  const [nominees, setNominees] = useState<AccountId[]>();
  const [offlineTotal, setOfflineTotal] = useState<BN>(new BN(0));

  const currentAccount = location.pathname.split('/')[2];

  useEffect(() => {
    const subscription: Subscription = (
        api.queryMulti([
          [api.query.staking.bonded, validator], // try to map to controller
          [api.query.staking.ledger, validator] // try to map to stash
        ]) as Observable<[Option<AccountId>, Option<StakingLedger>]>
      )
      .pipe(
        switchMap(([controllerId, stakingLedger]) => {
          const stashId = controllerId.isSome ? controllerId.unwrap() : stakingLedger.isSome ? stakingLedger.unwrap().stash : validator;
          return combineLatest([
            (api.query.staking.nominators(stashId) as unknown as Observable<[AccountId[]]>),
            (api.query.staking.stakers(stashId) as Observable<Exposure>)
          ]);
        }),
        first()
      )
      .subscribe(([nominators, stakers]) => {
        const nominations = stakers ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value]) : [];
        setNominees(nominators[0]); // the list of accounts this account is nominating
        setNominations(nominations); // the list of accounts that nominated this account
      });

    fromNullable(offlineStatuses)
      .map(offlineStatuses => offlineStatuses.reduce((total, { count }) => total.add(count), new BN(0)))
      .map(setOfflineTotal)
      .getOrElse(undefined);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Table.Row key={validator.toString()} style={{ height: '200px' }}>
      <Table.Cell>
        {
          fromNullable(nominees)
            .map(nominees => nominees.includes(new AccountId(currentAccount)) && <Icon name='check' />)
            .getOrElse(<div></div>)
        }
      </Table.Cell>
      <Table.Cell width='5'>
        <AddressSummary
          address={validator.toString()}
          justifyContent='center'
          orientation='vertical'
          name={fromNullable(keyring.getAddress(validator.toString()))
                  .chain(account => some(account.meta))
                  .chain(meta => some(meta.name))
                  .getOrElse(undefined)}
          noPlaceholderName
          size='medium' />
      </Table.Cell>
      <Table.Cell textAlign='center' width='1'>{offlineTotal.toString()}</Table.Cell>
      <Table.Cell collapsing width='5'>
        {
          nominations.length > 0
            ? nominations.map(([who, bonded]) => (
              <Stacked key={who.toString()}>
                <AddressSummary address={who.toString()} orientation='horizontal' noPlaceholderName size='tiny' />
                <FadedText>Bonded Amount: {formatBalance(bonded)}</FadedText>
              </Stacked>
              ))
            : <Loader active inline />
        }
      </Table.Cell>
      <Table.Cell width='2'>
        <ConfirmNominationDialog history={props.history} nominatee={validator.toString()} />
      </Table.Cell>
    </Table.Row>
  );
}
