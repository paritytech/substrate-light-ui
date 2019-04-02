// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@substrate/ui-components';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import { SavedAccounts } from './SavedAccounts';
import { ManageAccounts } from './ManageAccounts';
import { IdentityManagementScreen } from './types';

interface Props extends RouteComponentProps {}

type State = {
  screen: IdentityManagementScreen
};

const accountManagementOptions = [
  {
    key: 'Edit',
    text: 'Edit',
    value: 'Edit'
  },
  {
    key: 'Create',
    text: 'Create',
    value: 'Create'
  },
  {
    key: 'Restore',
    text: 'Restore',
    value: 'Restore'
  }
];

const addressManagementOptions = [
  {
    key: 'Lookup',
    text: 'Lookup',
    value: 'Lookup'
  },
  {
    key: 'Add',
    text: 'Add',
    value: 'Add'
  }
];

export class Identity extends React.PureComponent<Props> {
  state: State = {
    screen: 'Edit'
  };

  handleMenuOptionSelected = (event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
    this.setState({
      screen: value
    });
  }

  render () {
    const { screen } = this.state;

    return (
      <Container>
        <Menu>
          <Dropdown
              fluid
              onChange={this.handleMenuOptionSelected}
              options={accountManagementOptions}
              placeholder='Manage Accounts'
              selection
            />
          <Dropdown
              fluid
              onChange={this.handleMenuOptionSelected}
              options={addressManagementOptions}
              placeholder='Manage Addresses'
              selection
            />
        </Menu>

        {
          ['Edit', 'Create', 'Restore'].includes(screen)
            ? this.renderManageAccounts()
            : this.renderManageAddresses()
        }
      </Container>
    );
  }

  renderManageAccounts () {
    return (
      <React.Fragment>
        <SavedAccounts />
        <ManageAccounts screen={screen} />
      </React.Fragment>
    );
  }

  renderManageAddresses () {
    return ('implement this later ');
    // return (
    //   <React.Fragment>
    //     <SavedAddresses />
    //     <ManageAddresses screen={screen} />
    //   <React.Fragment>
    // );
  }
}
