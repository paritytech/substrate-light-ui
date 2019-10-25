// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Menu } from '@substrate/ui-components';
import React, { useState, useEffect } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { AccountsOverview, AccountOverviewDetailed } from './Accounts';
import { StakingOptions } from './Staking';
import { ValidatorsList } from './Validators';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>

const Options = (props: Props): React.ReactElement => {
  const { history, location, match: { params: { currentAccount } } } = props;
  const [active, setActive] = useState();

  useEffect(() => {
    setActive(location.pathname.split('/')[3]);
  });

  const navToOverview = (): void => {
    history.push(`/manageAccounts/${currentAccount}/overview`);
  };

  const navToBalance = (): void => {
    history.push(`/manageAccounts/${currentAccount}/balances`);
  };

  const navToStaking = (): void => {
    history.push(`/manageAccounts/${currentAccount}/staking`);
  };

  const navToValidators = (): void => {
    history.push(`/manageAccounts/${currentAccount}/validators`);
  };

  return (
    <Menu>
      <Menu.Item active={active === 'overview'} onClick={navToOverview} > View All Accounts</Menu.Item>
      <Menu.Item active={active === 'balances'} onClick={navToBalance} > Detailed Balances </Menu.Item>
      <Menu.Item active={active === 'staking'} onClick={navToStaking} > Staking Options </Menu.Item>
      <Menu.Item active={active === 'validators'} onClick={navToValidators} > Validators </Menu.Item>
    </Menu>
  );
};

export function Accounts (): React.ReactElement {
  return (
    <React.Fragment>
      <Route component={Options} />
      <Switch>
        <Route path='/manageAccounts/:currentAccount/overview' component={AccountsOverview} />
        <Route path='/manageAccounts/:currentAccount/balances' component={AccountOverviewDetailed} />
        <Route path='/manageAccounts/:currentAccount/staking' component={StakingOptions} />
        <Route path='/manageAccounts/:currentAccount/validators' component={ValidatorsList} />
        <Redirect from='/manageAccounts/:currentAccount' to='/manageAccounts/:currentAccount/overview' />
      </Switch>
    </React.Fragment>
  );
}

export * from './Staking';
export const Validators = ValidatorsList;
