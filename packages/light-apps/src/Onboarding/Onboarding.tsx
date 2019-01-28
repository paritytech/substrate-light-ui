// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Modal } from '@polkadot/ui-components';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { CreateNewAccountScreen, ImportOptionsScreen, SaveScreen } from './index';

interface Props extends RouteComponentProps {}

export class Onboarding extends React.Component<Props> {
  render () {
    return (
      <Modal
        dimmer='inverted'
        open
        size='tiny'
      >
        <Container>
          <Switch>
            <Redirect exact path='/' to='/create' />
            <Route path='/create' component={CreateNewAccountScreen} />
            <Route path='/import' component={ImportOptionsScreen} />
            <Route path='/save/:with' component={SaveScreen} />
          </Switch>
        </Container>
      </Modal>
    );
  }
}
