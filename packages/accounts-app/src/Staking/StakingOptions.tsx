// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Card, FadedText, Header, Icon, Margin, Stacked, StackedHorizontal, Step, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useState, useEffect } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Bond } from './Bond';
import { Setup } from './Setup';

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function StakingOptions (props: Props) {
  const { system: { properties: { tokenSymbol }, chain } } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState();

  useEffect(() => {
    const { location } = props;
    const step = location.pathname.split('/')[4];
    setActiveStep(step);
  }, []);

  return (
      <Card height='100%'>
        <Card.Header>
          <Header noMargin>Staking Your {tokenSymbol || 'UNIT'}'s on {chain}.</Header>
          <FadedText>Staking helps secure the network and also gives you a chance at earning a portion of the rewards, if the Validators you nominate successfully author a block.</FadedText>
          <SubHeader>Be Careful! You can also get slashed if your Validator misbehaves.</SubHeader>
        </Card.Header>
        <Card.Content>
          <Switch>
            <Route path='/manageAccounts/:currentAccount/staking/setup' component={Setup} />
            <Route path='/manageAccounts/:currentAccount/staking/bond' component={Bond} />
            <Redirect from='/manageAccounts/:currentAccount/staking/' to='/manageAccounts/:currentAccount/staking/setup' />
          </Switch>
        </Card.Content>
      </Card>
  );
}
