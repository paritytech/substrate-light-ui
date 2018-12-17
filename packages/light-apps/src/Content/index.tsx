// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Container, IdentityCard } from '@polkadot/ui-components';

import routing from '../routing';
import NotFound from './NotFound';

type Props = RouteComponentProps & {};

const unknown = {
  Component: NotFound,
  name: ''
};

const ID_CARD_ACTIONS: { [key: string]: { [key: string]: string } } = {
  'Identity': {
    'value': 'Transfer Balance',
    'to': 'Transfer'
  },
  'Transfer': {
    'value': 'Manage Accounts',
    'to': 'Identity'
  }
};

// @ts-ignore
@(withRouter as any)
class Content extends React.Component<Props> {
  render () {
    const { location } = this.props;

    const app = location.pathname.slice(1) || '';
    const { Component, name } = routing.routes.find((route) =>
      !!(route && app.indexOf(route.name) === 0)
    ) || unknown;

    const idCardAction = ID_CARD_ACTIONS[name] || ID_CARD_ACTIONS['Identity'];

    return (
      <Container>
        <IdentityCard value={idCardAction['value']} to={idCardAction['to']} address={'7qroA7r5Ky9FHN5mXA2GNxZ79ieStv4WYYjYe3m3XszK9SvF'} />
        <Component basePath={`/${name}`} />
      </Container>
    );
  }
}

// FIXME:
// address should come from Keyring

export default Content;
