// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Modal } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { CreateNewAccountScreen, ImportOptionsScreen, SaveScreen, WelcomeScreen } from './index';

export function Onboarding () {
  return (
    <Modal
      dimmer='inverted'
      open
      size='large'
    >
      <Container>
        <Switch>
          <Route path='/welcome' component={WelcomeScreen} />
          <Route path='/create' component={CreateNewAccountScreen} />
          <Route path='/import' component={ImportOptionsScreen} />
          <Route path='/save/:importMethod' component={SaveScreen} />
          <Redirect to='/welcome' />
        </Switch>
      </Container>
    </Modal>
  );
}
