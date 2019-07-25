// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types';
import { AppContext, StakingContext } from '@substrate/ui-common';
import { AddressSummary, Container, Grid, Loading, SubHeader, WithSpace } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import { BalanceOverview } from './BalanceOverview';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
  name: string;
}

export const rewardDestinationOptions = ['Send rewards to my Stash account and immediately use it to stake more.', 'Send rewards to my Stash account but do not stake any more.', 'Send rewards to my Controller account.'];

export function AccountsOverviewDetailed (props: Props) {
  const { history, match: { params: { currentAccount } } } = props;
  const { api } = useContext(AppContext);
  const { accountStakingMap } = useContext(StakingContext);
  const [stakingInfo, setStakingInfo] = useState<DerivedStaking>();

  useEffect(() => {
    fromNullable(accountStakingMap[currentAccount])
      .map(setStakingInfo)
      .getOrElse(/* do nothing */);
  }, [api]);

  const renderBalanceDetails = () => {
    return (
      <Card>
        <Card.Content>
        {
          fromNullable(stakingInfo)
            .map((stakingInfo) => <BalanceOverview history={history} {...stakingInfo} />)
            .getOrElse(<Loading active />)
        }
        </Card.Content>
      </Card>
    );
  };

  const renderNominationDetails = () => {
    return (
      <Card>
        <Card.Content>
        <WithSpace>
          <SubHeader noMargin>Currently Nominating:</SubHeader>
            {
              fromNullable(stakingInfo)
                .mapNullable(stakingInfo => stakingInfo.nominators)
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
            <SubHeader>Reward Destination: </SubHeader>
            {
              fromNullable(stakingInfo)
                .mapNullable(({ rewardDestination }) => rewardDestination)
                .map(rewardDestination => rewardDestinationOptions[rewardDestination.toNumber()])
                .getOrElse('Reward Destination Not Set...')
            }
          </Grid.Row>
        </WithSpace>
        </Card.Content>
      </Card>
    );
  };

  const renderGeneral = () => {
    const isStashNominating = fromNullable(stakingInfo)
      .mapNullable(({ nominators }) => nominators)
      .map(nominators => nominators.length > 0)
      .getOrElse(false);

    const isStashValidating = fromNullable(stakingInfo)
      .mapNullable(({ validatorPrefs }) => validatorPrefs)
      .map(validatorPrefs => !!validatorPrefs && !validatorPrefs.isEmpty && !isStashNominating)
      .getOrElse(false);

    return (
      <Card.Group centered doubling stackable>
        <Card>
          <Card.Content>
            <AddressSummary
              address={currentAccount}
              detailed
              isNominator={isStashNominating}
              isValidator={isStashValidating}
              name={name}
              size='small' />
          </Card.Content>
        </Card>
        {renderBalanceDetails()}
        {renderNominationDetails()}
      </Card.Group>
    );
  };

  return (
    <Container>
      <Grid columns='16'>
        {
          fromNullable(stakingInfo)
            .map(stakingInfo => renderGeneral())
            .getOrElse(<div></div>)
        }
      </Grid>
    </Container>
  );
}
