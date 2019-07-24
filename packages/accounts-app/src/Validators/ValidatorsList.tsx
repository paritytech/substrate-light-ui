// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { AccountId, Header } from '@polkadot/types';
import { Container, FadedText, Icon, Stacked, StackedHorizontal, Table, WrapperDiv } from '@substrate/ui-components';
import { AppContext } from '@substrate/ui-common';
import BN from 'bn.js';
import { fromNullable } from 'fp-ts/lib/Option';
import localforage from 'localforage';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take, first } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { AccountOfflineStatusesMap, OfflineStatus, RecentlyOffline } from '../Accounts/types';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { api } = useContext(AppContext);
  const [recentlyOffline, setRecentlyOffline] = useState<AccountOfflineStatusesMap>({});
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [lastBlock, setLastBlock] = useState<number>();
  const [lastUpdatedRecentlyOffline, setLastUpdatedRecentlyOffline] = useState<number>();
  const [sessionInfo, setSessionInfo] = useState<DerivedSessionInfo>();
  const [validatorCount, setValidatorCount] = useState<BN>(new BN(0));

  // let _isMounted = false;

  // useEffect(() => {
  //   // ~= componentDidMount
  //   _isMounted = true;

  //   // ~= componentDidUnmount
  //   return () => {
  //     _isMounted = false;
  //   };
  // }, []);

  /*
    Creates a new subscription to session validators and sets it to state, persists to localstorage.
    Called automatically if not already set in localstorage or at the start of a new session.
    Unsubscribes immediately after setting state and localstorage.
  */
  const refreshValidators = useMemo(() => {
    setCurrentValidatorsControllersV1OrStashesV2([]); // so that it shows loader again
    const validatorSub: Subscription = (api.query.session.validators() as unknown as Observable<AccountId[]>)
      .pipe(first())
      .subscribe(validators => {
        localforage.setItem('validators', validators)
          .then(() => setCurrentValidatorsControllersV1OrStashesV2(validators))
          .catch(e => console.error(e));
      });
    return () => validatorSub.unsubscribe();
  }, [api]);

  // If it is the start of a new session, make a new query to get the session validators automatically
  useLayoutEffect(() => {
    fromNullable(sessionInfo)
      .map(sessionInfo => sessionInfo.sessionProgress.toNumber() === 0 && refreshValidators())
      .getOrElse(false);
  }, [api, refreshValidators]);

  // set state with validators from localstorage if persisted in localstorage, else make new query
  useLayoutEffect(() => {
    localforage.getItem('validators')
      .then(validators => {
        if (!validators) {
          return refreshValidators();
        } else {
          setCurrentValidatorsControllersV1OrStashesV2(validators as AccountId[]);
        }
      })
      .catch(e => console.error(e));
  }, [api]);

  /*
    Creates a new subscription to recently offline and latest chain head and sets it to state, persists in localstorage.
    Called automatically if not set in localstorage, or manually by user.
    Unsubscribes immediately after setting state and localstorage.
  */
  const refreshRecentlyOffline = useMemo(() => {
    setLastUpdatedRecentlyOffline(undefined); // so that it shows loader again
    const recentlyOfflineSub: Subscription = combineLatest([
      (api.query.staking.recentlyOffline() as unknown as Observable<any>),
      (api.rpc.chain.subscribeNewHead() as Observable<Header>)
    ]).pipe(first())
      .subscribe(([stakingRecentlyOffline, header]) => {
        const recentlyOffline = stakingRecentlyOffline.reduce(
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
          }, {} as AccountOfflineStatusesMap);

        localforage.setItem('recentlyOffline', recentlyOffline)
          .then(() => {
            setRecentlyOffline(recentlyOffline);
            localforage.setItem('lastUpdatedRecentlyOffline', header.blockNumber.toNumber())
              .then(() => setLastUpdatedRecentlyOffline(header.blockNumber.toNumber()))
              .catch(e => console.error(e));
          })
          .catch(e => console.error(e));
      });
    return () => recentlyOfflineSub.unsubscribe();
  }, [api]);

  // set state with recentlyOffline from localstorage if persisted in localstorage, else make new query
  useLayoutEffect(() => {
    localforage.getItem('recentlyOffine')
      .then((res: any) => {
        if (!res) {
          refreshRecentlyOffline();
        } else {
          setRecentlyOffline(res);
          return;
        }
      })
      .catch(e => console.error(e));
  }, [api]);

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.rpc.chain.subscribeNewHead() as Observable<Header>),
      (api.derive.session.info() as Observable<DerivedSessionInfo>),
      (api.query.staking.validatorCount() as unknown as Observable<BN>)
    ])
    .pipe(
      take(1)
    )
    .subscribe(([header, sessionInfo, validatorCount]) => {
      setLastBlock(header.blockNumber.toNumber());
      setSessionInfo(sessionInfo);
      setValidatorCount(validatorCount);
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
              <WrapperDiv margin='0rem' padding='0rem' width='20rem'>
                {
                  fromNullable(sessionInfo)
                    .map(sessionInfo =>
                      <Progress
                        color='pink'
                        label='session'
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
          <Table.HeaderCell>
            <Stacked>
              Times Reported Offline
              <StackedHorizontal>
                {lastUpdatedRecentlyOffline && lastBlock ? <FadedText>last updated: {Math.abs(lastBlock - lastUpdatedRecentlyOffline)} blocks ago </FadedText> : <Loader inline active size='mini' /> }
                <Icon name='refresh' onClick={refreshRecentlyOffline} style={{ zIndex: 10000 }} />
              </StackedHorizontal>
            </Stacked>
          </Table.HeaderCell>
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
