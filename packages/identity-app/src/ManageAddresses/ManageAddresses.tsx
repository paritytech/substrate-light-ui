// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dropdown, Menu } from '@substrate/ui-components';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { SaveAddress } from './SaveAddress';
import { MatchParams } from '../types';

interface Props extends RouteComponentProps<MatchParams> { }

const menuOptions = [
  {
    key: 'Add',
    text: 'Add',
    value: 'Add'
  }
];

export class ManageAddresses extends React.PureComponent<Props> {
  render () {
    return (
      <React.Fragment>
        {this.renderMenu()}
        <Switch>
          {/* FIXME add route for Edit component */}
          <Route component={SaveAddress} />
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
        <Dropdown
          item
          options={menuOptions}
          value='Add'
        />
      </Menu>
    );
  }
}
