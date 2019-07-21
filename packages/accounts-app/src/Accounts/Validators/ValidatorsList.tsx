// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { Container, FlexItem, Table } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import localForage from 'localforage';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';
import { Loader } from 'semantic-ui-react';

import { AccountOfflineStatusesMap, OfflineStatus, RecentlyOffline } from '../types';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [recentlyOffline, setRecentlyOffline] = useState<AccountOfflineStatusesMap>();
  const [allControllers, setAllControllers] = useState([]);
  const [allStashes, setAllStashes] = useState([]);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);

  // FIXME: cache validators accountIds in context while showing: refreshing....last queried 4 minutes ago.
  useEffect(() => {
    combineLatest([
      (api.derive.staking.controllers() as unknown as Observable<any>),
      (api.query.staking.recentlyOffline() as unknown as Observable<any>),
      (api.query.session.validators() as unknown as Observable<AccountId[]>)
    ])
    .subscribe(([allStashesAndControllers, stakingRecentlyOffline, validators]) => {
      setAllControllers(allStashesAndControllers[1].filter((optId: any): boolean => optId.isSome).map((accountId: any): string => accountId.unwrap().toString()));
      setAllStashes(allStashesAndControllers[0].map((accountId: any): string => accountId.toString()));
      setCurrentValidatorsControllersV1OrStashesV2(validators);
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

            console.log(result);

            return result;
          }, {} as unknown as AccountOfflineStatusesMap)
      );

      console.log(recentlyOffline);
    });
  }, []);

  const renderBody = () => (
    <Table.Body>
      {
        currentValidatorsControllersV1OrStashesV2.length
          ? currentValidatorsControllersV1OrStashesV2.map(validator =>
            <ValidatorRow
              offlineStatuses={recentlyOffline && recentlyOffline[validator.toString()]} validator={validator} />
            )
          : <Loader active inline />
      }
    </Table.Body>
  );

  const renderHeader = () => (
    <Table.Header>
      <Table.HeaderCell>Validators {`(${currentValidatorsControllersV1OrStashesV2.length})` || <Loader active inline size='small' />}</Table.HeaderCell>
      <Table.HeaderCell>Times Reported Offline</Table.HeaderCell>
      <Table.HeaderCell>Nominators</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Header>
  );

  return (
    <Container fluid>
      <Table celled collapsing fixed stackable width='100%' verticalAlign='middle'>
        {renderHeader()}
        {renderBody()}
      </Table>
    </Container>
  );
}
