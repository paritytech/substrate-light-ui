// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Intro, ChooseCreationOption, SetupNominator } from './index';

interface Props extends RouteComponentProps { }

export function WelcomeScreen (props: Props) {
  return (
    <Switch>
      <Route path='/welcome/intro' component={Intro} />
      <Route path='/welcome/chooseCreationOption/:option' component={ChooseCreationOption} />
      <Route path='/welcome/setupNominator' component={SetupNominator} />
      <Redirect exact to='/welcome/intro' />
    </Switch>
  );
}
