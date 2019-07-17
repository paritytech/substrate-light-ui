// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { Container, Table } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';

import { AccountOfflineStatusesMap, OfflineStatus, RecentlyOffline } from '../types';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [recentlyOffline, setRecentlyOffline] = useState<AccountOfflineStatusesMap>();
  const [validators, setValidators] = useState<AccountId[]>();

  useEffect(() => {
    combineLatest([
      (api.query.staking.recentlyOffline() as unknown as Observable<any>),
      (api.query.session.validators() as unknown as Observable<AccountId[]>)
    ])
    .subscribe(([stakingRecentlyOffline, validators]) => {
      setRecentlyOffline(
        stakingRecentlyOffline.reduce(
          (result: AccountOfflineStatusesMap, [accountId, blockNumber, count]: RecentlyOffline): AccountOfflineStatusesMap => {
            const account = accountId.toString();

            if (!result[account]) {
              result[account] = [];
            }

            result[account].push({
              blockNumber,
              count
            } as unknown as OfflineStatus);

            return result;
          }, {} as unknown as AccountOfflineStatusesMap)
      );
      setValidators(validators);
    });
  });

  const renderHeader = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Validators ({validators && validators.length}) </Table.HeaderCell>
          <Table.HeaderCell>Times Reported Offline</Table.HeaderCell>
          <Table.HeaderCell>Nominators</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  return (
    <Container>
      <Table basic='very' celled collapsing>
        {renderHeader()}
        <Table.Body>
        {
          validators && validators.map(validator => {
            const name = fromNullable(keyring.getAccount(validator))
              .chain(account => some(account.meta))
              .chain(meta => some(meta.name))
              .getOrElse(undefined);

            return <ValidatorRow
                      name={name}
                      offlineStatuses={
                        fromNullable(recentlyOffline)
                            .map(recentlyOffline => recentlyOffline[validator.toString()])
                            .getOrElse([])
                      }
                      validator={validator}
                    />;
          })
        }
        </Table.Body>
      </Table>
    </Container>
  );
}
