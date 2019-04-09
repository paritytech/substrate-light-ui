// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { stringUpperFirst } from '@polkadot/util';
import { Dropdown, Menu } from '@substrate/ui-components';
import React from 'react';
import { Link, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Create } from './Create';
import { Edit } from './Edit';
import { Restore } from './Restore';
import { MatchParams } from '../types';

interface Props extends RouteComponentProps<MatchParams> { }

export class ManageAccounts extends React.PureComponent<Props> {
  render () {
    return (
      <React.Fragment>
        {this.renderMenu()}
        <Switch>
          <Route path='/identity/:currentAccount/create' component={Create} />
          <Route path='/identity/:currentAccount/restore' component={Restore} />
          <Route path='/identity/:currentAccount/edit' component={Edit} />
          <Redirect to='/identity/:currentAccount/edit' />
        </Switch>
      </React.Fragment>
    );
  }

  renderMenu () {
    const { location: { pathname }, match: { params: { currentAccount } } } = this.props;

    return (
      <Menu>
        <Menu.Item as={Link} to={`/identity/${currentAccount}/addresses`}>
          Manage Addresses
        </Menu.Item>
        <Dropdown item text={stringUpperFirst(pathname.split('/').slice(-1)[0])}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/identity/${currentAccount}`}>Edit</Dropdown.Item>
            <Dropdown.Item as={Link} to={`/identity/${currentAccount}/create`}>Create</Dropdown.Item>
            <Dropdown.Item as={Link} to={`/identity/${currentAccount}/restore`}>Restore</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }
}
