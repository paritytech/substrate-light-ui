// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dropdown, Menu } from '@substrate/ui-components';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Add } from './Add';
import { Edit } from './Edit';
import { MatchParams } from '../types';

interface Props extends RouteComponentProps<MatchParams> { }

export class ManageAddresses extends React.PureComponent<Props> {
  render () {
    return (
      <React.Fragment>
        {this.renderMenu()}
        <Switch>
          <Route path='/identity/:currentAccount/addresses/:address' component={Edit} />
          <Route component={Add} />
        </Switch>
      </React.Fragment>
    );
  }

  renderMenu () {
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <Menu>
        <Menu.Item as={Link} to={`/identity/${currentAccount}`}>
          Manage Accounts
        </Menu.Item>
        <Dropdown item text='Add'>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/identity/${currentAccount}/addresses`}>Add</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }
}
