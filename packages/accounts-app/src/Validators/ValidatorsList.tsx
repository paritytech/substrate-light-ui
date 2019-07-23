// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { Container, Table } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import BN from 'bn.js';
import localforage from 'localforage';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Loader } from 'semantic-ui-react';

import { AccountOfflineStatusesMap, OfflineStatus, RecentlyOffline } from '../Accounts/types';
import { ValidatorRow } from './ValidatorRow';
import { DerivedFees } from '@polkadot/api-derive/types';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [recentlyOffline, setRecentlyOffline] = useState<AccountOfflineStatusesMap>({});
  const [allControllers, setAllControllers] = useState<string[]>([]);
  const [allStashes, setAllStashes] = useState<string[]>([]);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [fees, setFees] = useState();
  const [validatorCount, setValidatorCount] = useState<BN>(new BN(0));

  useEffect(() => {
    localforage.getItem('validators')
      .then(validators => {
        if (!validators) {
          const validatorSub: Subscription = (api.query.session.validators() as unknown as Observable<AccountId[]>)
            .subscribe(validators => {
              console.log('got vlaidators => ', validators);
              debugger;
              localforage.setItem('validators', validators)
                .then(res => {
                  console.log('setting the validators => ', res);
                  debugger;
                  setCurrentValidatorsControllersV1OrStashesV2(res);
                  return () => validatorSub.unsubscribe();
                })
                .catch(e => console.error(e));
            });
        } else { setCurrentValidatorsControllersV1OrStashesV2(validators as AccountId[]) }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    localforage.getItem('recentlyOffine')
      .then((res: any) => {
        if (!res) {
          const recentlyOfflineSub: Subscription = (api.query.staking.recentlyOffline() as unknown as Observable<any>)
            .subscribe(stakingRecentlyOffline => {
              const recentlyOffline = stakingRecentlyOffline.reduce(
                (result: AccountOfflineStatusesMap, [accountId, blockNumber, count]: RecentlyOffline): AccountOfflineStatusesMap => {
                  const account = accountId.toString();

                  if (!result[account]) {
                    result[account] = [];
                  }

                  console.log('reducing recently offline -> ', result);

                  result[account].push({
                    blockNumber,
                    count
                  } as unknown as OfflineStatus);

                  return result;
                }, {} as AccountOfflineStatusesMap);

              localforage.setItem('recentlyOffline', recentlyOffline)
                .then(res => {
                  setRecentlyOffline(res);
                  return () => recentlyOfflineSub.unsubscribe();
                })
                .catch(e => console.error(e));
            });
        } else { setRecentlyOffline(res); }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.derive.staking.controllers() as unknown as Observable<any>),
      (api.derive.balances.fees() as Observable<DerivedFees>),
      (api.query.staking.validatorCount() as unknown as Observable<BN>)
    ])
    .pipe(
      take(1)
    )
    .subscribe(([allStashesAndControllers, fees, validatorCount]) => {
      const allControllers = allStashesAndControllers[1].filter((optId: any): boolean => optId.isSome).map((accountId: any): string => accountId.unwrap().toString());
      const allStashes = allStashesAndControllers[0].map((accountId: any): string => accountId.toString());

      setFees(fees);

      setAllControllers(allControllers);
      setAllStashes(allStashes);
      setValidatorCount(validatorCount);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderBody = () => (
    <Table.Body>
      {
        console.log('validators => ', currentValidatorsControllersV1OrStashesV2)
      }
      {
        currentValidatorsControllersV1OrStashesV2.length
          ? currentValidatorsControllersV1OrStashesV2.map(validator => {
            return <ValidatorRow
                      offlineStatuses={recentlyOffline && recentlyOffline[validator.toString()]}
                      validator={validator} />;
          })
          : <Table.Row textAlign='center'><Loader active inline /></Table.Row>
      }
    </Table.Body>
  );

  const renderHeader = () => {
    return (
      <Table.Header>
        <Table.HeaderCell>Validators {`${currentValidatorsControllersV1OrStashesV2.length} / ${validatorCount ? validatorCount.toString() : <Loader active inline size='small' />}`}</Table.HeaderCell>
        <Table.HeaderCell>Times Reported Offline</Table.HeaderCell>
        <Table.HeaderCell>Nominators</Table.HeaderCell>
        <Table.HeaderCell>Actions</Table.HeaderCell>
      </Table.Header>
    );
  };

  return (
    <Container fluid>
      <Table basic celled collapsing compact size='large' sortable stackable textAlign='center' width='16' verticalAlign='middle'>
        {renderHeader()}
        {renderBody()}
      </Table>
    </Container>
  );
}
