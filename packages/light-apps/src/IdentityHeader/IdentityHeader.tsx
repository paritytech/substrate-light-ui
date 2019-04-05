// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { stringUpperFirst } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { BalanceDisplay, Dropdown, DropdownProps, Menu } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, Subscription } from 'rxjs';

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
  balance?: Balance
};

export class IdentityHeader extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {

  };

  subscription?: Subscription;

  componentDidMount () {
    this.subscribeBalance();
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.location.pathname.split('/')[2]
        !== this.props.location.pathname.split('/')[2]) {
      this.closeSubscription();
      this.subscribeBalance();
    }
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
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
    const { history } = this.props;
    const currentLocation = this.getCurrentLocation();

    history.push(`/${currentLocation}/${account}`);
  }

  handleToggleApp = (event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
    const { history } = this.props;
    const address = this.getAddress();

    history.push(`/${value}/${address}`);
  }

  subscribeBalance = () => {
    const { api } = this.context;
    const currentAccount = this.getAddress();

    // Subscribe to sender's balance
    // FIXME using any because freeBalance gives a Codec here, not a Balance
    // Wait for @polkadot/api to have TS support for all query.*
    this.subscription = (api.query.balances.freeBalance(currentAccount) as Observable<Balance>)
      .subscribe((balance) => this.setState({ balance }));
  }

  render () {
    const { balance } = this.state;

    const address = this.getAddress();
    const currentLocation = this.getCurrentLocation();

    return (
      <Menu>
        <Menu.Item>
          <InputAddress
            label={null}
            onChange={this.handleChangeCurrentAccount}
            type='all'
            value={address}
            withLabel={false}
          />
        </Menu.Item>
        <Menu.Item>
          {this.renderBalance(balance)}
        </Menu.Item>
        <Dropdown
          item
          onChange={this.handleToggleApp}
          options={APP_OPTIONS}
          text={stringUpperFirst(currentLocation)}
          value={stringUpperFirst(currentLocation)}
          />
     </Menu>
    );
  }

  renderBalance (balance?: Balance) {
    return balance && <BalanceDisplay balance={balance} />;
  }
}
