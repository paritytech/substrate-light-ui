// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ApiContext, StakingContext } from '@substrate/context';
import { AddressSummary, Margin, Stacked, SubHeader, WithSpace } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import { rewardDestinationOptions } from '../constants';
import { BalanceOverview } from './BalanceOverview';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
  name: string;
}

export function AccountOverviewDetailed(props: Props): React.ReactElement {
  const {
    history,
    match: {
      params: { currentAccount },
    },
  } = props;
  const { api } = useContext(ApiContext);
  const { accountStakingMap, allStashes } = useContext(StakingContext);
  const [nominees, setNominees] = useState();

  const stakingInfo = accountStakingMap[currentAccount];

  useEffect(() => {
    setNominees(
      stakingInfo &&
        stakingInfo.nominators &&
        stakingInfo.nominators.map((nominator: AccountId) => nominator.toString())
    );
  }, [stakingInfo]);

  const renderBalanceDetails = (): React.ReactElement => {
    return (
      <Card>
        <Card.Content>
          {fromNullable(stakingInfo)
            .map(stakingInfo => (
              <BalanceOverview history={history} key={stakingInfo.accountId.toString()} {...stakingInfo} />
            ))
            .getOrElse(<Loader active inline />)}
        </Card.Content>
      </Card>
    );
  };

  const renderNominationDetails = (): React.ReactElement => {
    return (
      <Card>
        <Card.Content>
          <SubHeader noMargin>Currently Nominating:</SubHeader>
          <WithSpace style={{ height: '30rem', overflow: 'auto' }}>
            {fromNullable(nominees)
              .map(nominees =>
                nominees.map((nomineeId: string, index: string) => (
                  <AddressSummary address={nomineeId} key={index} orientation='horizontal' size='small' />
                ))
              )
              .getOrElse(
                <Stacked>
                  Not Nominating Anyone.
                  <Link to={`/manageAccounts/${currentAccount}/validators`}>View Validators</Link>
                </Stacked>
              )}
          </WithSpace>
          <WithSpace>
            <SubHeader>Reward Destination: </SubHeader>
            {fromNullable(stakingInfo)
              .mapNullable(({ rewardDestination }) => rewardDestination)
              .map(rewardDestination => rewardDestinationOptions[rewardDestination.toNumber()])
              .getOrElse('Reward Destination Not Set...')}
          </WithSpace>
        </Card.Content>
      </Card>
    );
  };

  const renderGeneral = (): React.ReactElement => {
    const isStashNominating = fromNullable(stakingInfo)
      .mapNullable(({ nominators }) => nominators)
      .map(nominators => nominators.length > 0)
      .getOrElse(false);

    const isStashValidating = fromNullable(allStashes)
      .map(allStashes => allStashes.includes(api.createType('AccountId', currentAccount)))
      .getOrElse(false);

    const accountType = fromNullable(stakingInfo).map(stakingInfo =>
      api.createType('AccountId', currentAccount).eq(stakingInfo.controllerId) ? 'controller' : 'stash'
    );

    const bondingPair = fromNullable(stakingInfo)
      .map(stakingInfo =>
        accountType.fold(undefined, accountType =>
          accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId
        )
      )
      .getOrElse(undefined);

    return (
      <Card.Group doubling stackable>
        <Margin left='huge' />
        <Card>
          <Card.Content>
            <AddressSummary
              address={currentAccount}
              bondingPair={bondingPair && bondingPair.toString()}
              detailed
              isNominator={isStashNominating}
              isValidator={isStashValidating}
              name={name}
              size='small'
            />
          </Card.Content>
        </Card>
        <Margin left />
        {renderBalanceDetails()}
        <Margin left />
        {renderNominationDetails()}
      </Card.Group>
    );
  };

  return renderGeneral();
}
