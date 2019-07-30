// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types';
import { Container, FadedText, Stacked, Table, WrapperDiv } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import BN from 'bn.js';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { AccountOfflineStatusesMap, RecentlyOffline } from '../types';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [sessionInfo, setSessionInfo] = useState<DerivedSessionInfo>();
  const [validatorCount, setValidatorCount] = useState<BN>(new BN(0));
  const [recentlyOffline, setRecentlyOffline] = useState();

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.derive.session.info() as Observable<DerivedSessionInfo>),
      (api.query.staking.recentlyOffline() as unknown as Observable<RecentlyOffline>),
      (api.query.session.validators() as unknown as Observable<AccountId[]>),
      (api.query.staking.validatorCount() as unknown as Observable<BN>)
    ])
    .pipe(first())
    .subscribe(([sessionInfo, stakingRecentlyOffline, validators, validatorCount]) => {
      setSessionInfo(sessionInfo);
      setCurrentValidatorsControllersV1OrStashesV2(validators);
      setValidatorCount(validatorCount);
      setRecentlyOffline(
        stakingRecentlyOffline.reduce(
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
          }, {} as unknown as AccountOfflineStatusesMap)
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderBody = () => (
    <Table.Body>
      {
        currentValidatorsControllersV1OrStashesV2.length
          ? currentValidatorsControllersV1OrStashesV2.map(validator => {
            return <ValidatorRow
                      key={validator.toString()}
                      history={props.history}
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
        <Table.Row>
          <Table.HeaderCell>Am I Nominating?</Table.HeaderCell>
          <Table.HeaderCell>
            <Stacked>
              Validators {`${currentValidatorsControllersV1OrStashesV2.length} / ${validatorCount ? validatorCount.toString() : <Loader active inline size='small' />}`}
              <FadedText> New Validator Set In: </FadedText>
              <WrapperDiv margin='0rem' padding='0rem' width='13rem'>
                {
                  fromNullable(sessionInfo)
                    .map(sessionInfo =>
                      <Progress
                        color='pink'
                        progress='ratio'
                        size='small'
                        total={sessionInfo.sessionLength.toNumber()}
                        value={sessionInfo.sessionProgress.toNumber()} />
                    )
                    .getOrElse(<Loader active inline size='mini' />)
                }
              </WrapperDiv>
            </Stacked>
          </Table.HeaderCell>
          <Table.HeaderCell>Times Reported Offline</Table.HeaderCell>
          <Table.HeaderCell>Nominators</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
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
