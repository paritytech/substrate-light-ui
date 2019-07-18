// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance, Exposure, RewardDestination } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Card, Container, Grid, Loading, SubHeader, WithSpace } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, Subscription } from 'rxjs';

import { BalanceOverview } from './BalanceOverview';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
  name: string;
}

// FIXME: remove all explicit anys
interface State {
  controllerId?: string;
  isStashNominating?: boolean;
  isStashValidating?: boolean;
  nominators?: AccountId[];
  rewardDestination?: RewardDestination;
  sessionId?: string;
  stashActive?: any;
  stakers?: Exposure;
  stashId?: string;
  stashTotal: string;
}

export function AccountsOverviewDetailed (props: Props) {
  const { match: { params: { currentAccount } } } = props;
  const { api } = useContext(AppContext);
  const [state, setState] = useState<State>();

  useEffect(() => {
    let subscription: Subscription =
      (api.derive.staking.info(currentAccount) as Observable<DerivedStaking>)
          .subscribe((stakingInfo: DerivedStaking) => {
            if (!stakingInfo) {
              return;
            }

            const { controllerId, nextSessionId, nominators, rewardDestination, stakers, stashId, stakingLedger, validatorPrefs } = stakingInfo;

            const isStashNominating = nominators && nominators.length !== 0;
            const isStashValidating = !!validatorPrefs && !validatorPrefs.isEmpty && !isStashNominating;

            const state = {
              controllerId: controllerId && controllerId.toString(),
              isStashNominating,
              isStashValidating,
              nominators,
              rewardDestination,
              sessionId: nextSessionId && nextSessionId.toString(),
              stashActive: stakingLedger ? formatBalance(stakingLedger.active) : formatBalance(new Balance(0)),
              stakers,
              stashId: stashId && stashId.toString(),
              stashTotal: stakingLedger ? formatBalance(stakingLedger.total) : formatBalance(new Balance(0))
            };

            setState(state);
          });
    return () => subscription.unsubscribe();
  }, [api]);

  const renderBalanceDetails = () => {
    return (
      <Card height='100%'>
        {
          fromNullable(state)
            .mapNullable(({ controllerId, stashId, stakers, stashActive, stashTotal }) => ({ address: currentAccount, controllerId, stashId, stakers, stashActive, stashTotal }))
            .map((props) => <BalanceOverview address={currentAccount} {...props} />)
            .getOrElse(<Loading active />)
        }
      </Card>
    );
  };

  const renderNominationDetails = () => {
    return (
      <Card height='100%'>
        <WithSpace>
          <SubHeader noMargin>Currently Nominating:</SubHeader>
            {
              fromNullable(state)
                .mapNullable(state => state.nominators)
                .map(nominators => nominators.map((address: AccountId) => {
                  return <AddressSummary
                    address={address.toString()}
                    key={address.toString()}
                    orientation='horizontal'
                    size='small'
                  />;
                }))
              .getOrElse([].map(() => <div>Not nominating anybody.</div>))
            }
        </WithSpace>
        <WithSpace>
          <Grid.Row>
            <SubHeader> Reward Destination: {fromNullable(state).mapNullable(state => state.rewardDestination).mapNullable(rewardDestination => rewardDestination.toString()).getOrElse('Destination not set.')} </SubHeader>
          </Grid.Row>
        </WithSpace>
      </Card>
    );
  };

  const renderGeneral = () => {
    return (
      <Grid.Row>
        <Grid.Column stretched width='6'>
          <Card><AddressSummary address={currentAccount} detailed isNominator={fromNullable(state).map(state => state.isStashNominating).getOrElse(undefined)} isValidator={fromNullable(state).map(state => state.isStashValidating).getOrElse(undefined)} name={name} size='medium' /></Card>
        </Grid.Column>
        <Grid.Column stretched width='5'>{renderBalanceDetails()} </Grid.Column>
        <Grid.Column stretched width='5'>{renderNominationDetails()}</Grid.Column>
      </Grid.Row>
    );
  };

  return (
    <Container>
      <Grid columns='16'>
        {
          fromNullable(state)
            .map(state => renderGeneral())
            .getOrElse(<div></div>)
        }
      </Grid>
    </Container>
  );
}
