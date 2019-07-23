// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, Stacked, Table, Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Loader } from 'semantic-ui-react';

import { OfflineStatus } from '../Accounts/types';
import { ConfirmNominationDialog } from './ConfirmNominationDialog';

interface Props {
  offlineStatuses?: OfflineStatus[];
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { offlineStatuses, validator } = props;
  const { api, keyring } = useContext(AppContext);
  const [nominations, setNominations] = useState<[AccountId, Balance][]>();
  const [nominees, setNominees] = useState<AccountId[]>();
  const [offlineTotal, setOfflineTotal] = useState<BN>(new BN(0));

  const currentAccount = location.pathname.split('/')[2];

  useEffect(() => {
    const subscription: Subscription =
      (api.derive.staking.info(validator) as Observable<DerivedStaking>).pipe(first()).subscribe((derivedStaking: DerivedStaking) => {
        const { nominators, stakers } = derivedStaking;
        const nominations = stakers ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value]) : [];

        setNominees(nominators); // the list of accounts this account is nominating
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
      <Table.Cell style={{ lineHeight: '0' }} width='5'>
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
      <Table.Cell textAlign='center' width='1'>{offlineTotal.toString()}</Table.Cell>
      <Table.Cell collapsing style={{ lineHeight: '0' }} width='5'>
        {
          nominations
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
        
      </Table.Cell>
    </Table.Row>
  );
}
