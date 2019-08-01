// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { Container, Table, FadedText, FlexItem } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import BN from 'bn.js';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';

import { SessionInfo } from './SessionInfo';
import { AccountOfflineStatusesMap, RecentlyOffline } from '../types';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [validatorCount, setValidatorCount] = useState<BN>(new BN(0));
  const [recentlyOffline, setRecentlyOffline] = useState();

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.query.staking.recentlyOffline() as unknown as Observable<RecentlyOffline>),
      (api.query.session.validators() as unknown as Observable<AccountId[]>),
      (api.query.staking.validatorCount() as unknown as Observable<BN>)
    ])
    .pipe(take(1))
    .subscribe(([stakingRecentlyOffline, validators, validatorCount]) => {
      setCurrentValidatorsControllersV1OrStashesV2(validators);
      setValidatorCount(validatorCount);

      const recentlyOffline = stakingRecentlyOffline.reduce(
        (result, [accountId, blockNumber, count]): AccountOfflineStatusesMap => {
          const account = accountId.toString();

          if (!result[account]) {
            result[account] = [];
          }

          result[account].push({
            blockNumber,
            count
          });

          return result;
        }, {} as unknown as AccountOfflineStatusesMap);

      setRecentlyOffline(recentlyOffline);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderBody = () => (
    <Table.Body>
      {
        fromNullable(currentValidatorsControllersV1OrStashesV2)
          .map(validators => validators.map(renderValidatorRow))
          .getOrElse([1].map(() => <Table.Row textAlign='center'><Loader active inline /></Table.Row>))
      }
    </Table.Body>
  );

  const renderValidatorRow = (validator: AccountId) => (
    <ValidatorRow
      key={validator.toString()}
      history={props.history}
      offlineStatuses={recentlyOffline && recentlyOffline[validator.toString()]}
      validator={validator} />
  );

  const renderHeader = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Am I Nominating?</Table.HeaderCell>
          <Table.HeaderCell>
            Validators {`${currentValidatorsControllersV1OrStashesV2.length} / ${validatorCount.toString()}`}
          </Table.HeaderCell>
          <Table.HeaderCell>Times Reported Offline</Table.HeaderCell>
          <Table.HeaderCell>Nominators</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {renderHeader()}
        {renderBody()}
      </React.Fragment>
    );
  };

  return (
    <Container fluid>
      <SessionInfo />
        {
          currentValidatorsControllersV1OrStashesV2.length
            ? (
              <Table basic celled collapsing compact size='large' sortable stackable textAlign='center' width='16' verticalAlign='middle'>
                {renderContent()}
              </Table>
            )
          : <FlexItem><FadedText>Loading current validator set... <Loader inline active /></FadedText></FlexItem>
        }
    </Container>
  );
}
