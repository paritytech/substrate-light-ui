// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Grid } from '@substrate/ui-components';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import { SavedAccounts } from './SavedAccounts';
import { SavedAddresses } from './SavedAddresses';
import { ManageAccounts } from './ManageAccounts';
import { ManageAddresses } from './ManageAddresses';
import { IdentityManagementScreen, MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {}

type State = {
  menuOption: 'Accounts' | 'Addresses',
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
    key: 'Add',
    text: 'Add',
    value: 'Add'
  }
];

export class Identity extends React.PureComponent<Props, State> {
  state: State = {
    menuOption: 'Accounts',
    screen: 'Edit'
  };

  handleMenuOptionSelected = (event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
    // @ts-ignore value won't be undefined but is an option in DropdownProps
    const menuOption = ['Add'].includes(value) ? 'Addresses' : 'Accounts';
    // @ts-ignore value won't be undefined but is an option in DropdownProps
    this.setState({
      menuOption,
      screen: value
    });
  }

  render () {
    const { screen } = this.state;

    return (
      <Grid>
        <Grid.Row>
            {
              ['Edit', 'Create', 'Restore'].includes(screen)
                ? this.renderManageAccounts()
                : this.renderManageAddresses()
            }
        </Grid.Row>
      </Grid>
    );
  }

  renderManageAccounts () {
    const { screen } = this.state;
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <React.Fragment>
        <Grid.Column width={7}> <SavedAccounts {...this.props} /> </Grid.Column>
        <Grid.Column width={9}>
          { this.renderMenu() }
          <ManageAccounts address={currentAccount} screen={screen} {...this.props} />
        </Grid.Column>
      </React.Fragment>
    );
  }

  renderManageAddresses () {
    const { screen } = this.state;
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <React.Fragment>
        <Grid.Column width={7}> <SavedAddresses {...this.props} /> </Grid.Column>
        <Grid.Column width={9}>
          { this.renderMenu() }
          <ManageAddresses address={currentAccount} screen={screen} {...this.props} />
        </Grid.Column>
      </React.Fragment>
    );
  }

  renderMenu () {
    const { menuOption, screen } = this.state;

    return (
      <Menu>
        <Dropdown
          item
          onChange={this.handleMenuOptionSelected}
          options={accountManagementOptions}
          text={menuOption === 'Accounts' ? screen as string : 'Manage Accounts'}
          value={menuOption === 'Accounts' && screen as string}
        />
        <Dropdown
          item
          onChange={this.handleMenuOptionSelected}
          options={addressManagementOptions}
          text={menuOption === 'Addresses' ? screen as string : 'Manage Addresses'}
          value={menuOption === 'Addresses' && screen as string}
        />
      </Menu>
    );
  }
}
