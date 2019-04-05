// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { Balance } from '@polkadot/types';
import { stringUpperFirst } from '@polkadot/util';
import { ApiContext } from '@substrate/ui-api';
import { Address, Menu } from '@substrate/ui-components';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { InputAddress } from './IdentityHeader.styles';

// TODO: Add Governance Once That's in
const APP_OPTIONS = [
  {
    key: 'Identity',
    text: 'Identity',
    value: 'Identity'
  },
  {
    key: 'Transfer',
    text: 'Transfer',
    value: 'Transfer'
  }];

interface Props extends RouteComponentProps { }

type State = {
  isReady: boolean
};

export class IdentityHeader extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    isReady: false
  };

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
  }

  getButtonText = () => {
    const currentLocation = this.getCurrentLocation();

    const to = currentLocation === 'identity' ? 'transfer' : 'identity';
    return stringUpperFirst(to);
  }

  getCurrentLocation = () => {
    const { location } = this.props;

    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    return currentLocation;
  }

  getName = () => {
    const { keyring } = this.context;
    const address = this.getAddress();

    return address && keyring.getAccount(address).getMeta().name;
  }

  handleChangeCurrentAccount = (account: string) => {
    const { history, match: { params } } = this.props;

    console.log(account, history, params);
  }

  handleToggleApp = (event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
    const { history } = this.props;
    const address = this.getAddress();

    history.push(`/${value}/${address}`);
  }

  render () {
    const address = this.getAddress();
    const currentLocation = this.getCurrentLocation();

    return (
      <Menu height='3rem'>
        <InputAddress
          label={null}
          onChange={this.handleChangeCurrentAccount}
          type='all'
          value={address}
          withLabel={false}
        />
        <Address address={address} />
        <Dropdown
          item
          onChange={this.handleToggleApp}
          options={APP_OPTIONS}
          text={currentLocation}
          value={currentLocation}
          />
     </Menu>
    );
  }

  // renderSummary = (balance: Balance) => {
  //   const address = this.getAddress();
  //   const name = this.getName();
  //
  //   return <AddressSummary address={address} balance={balance} name={name} />;
  // }
}
