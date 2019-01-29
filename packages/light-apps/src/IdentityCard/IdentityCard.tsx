// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import BN from 'bn.js';

import keyring from '@polkadot/ui-keyring';
import { Address, AddressSummary, NavButton } from '@polkadot/ui-components';

import { RouteComponentProps } from 'react-router-dom';

import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';
import { camlizeInclusiveFirst } from '../utils/camelize';

interface Props extends RouteComponentProps {}

type State = {
  address?: string,
  buttonText: string
  name?: string
};

const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');
// FIXME: balance should come from LightAPI HOC's observables
export class IdentityCard extends React.Component<Props, State> {
  state: State = {
    address: PLACEHOLDER_ADDRESS,
    buttonText: 'Transfer'
  };

  componentDidMount () {
    const { history, match, location } = this.props;

    // For Debugging purposes only
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      window.h = history;
      // @ts-ignore
      window.m = match;
      // @ts-ignore
      window.l = location;
    }

    const pairs = keyring.getPairs();
    const defaultAccount = pairs[0];
    const defaultAddress = defaultAccount.address();

    const address = location.pathname.split('/')[2] || defaultAddress;
    const name = keyring.getPair(address).getMeta().name || defaultAccount.getMeta().name;

    this.setState({
      address,
      name
    });
  }

  handleToggleApp = () => {
    const { address } = this.state;
    const { location, history } = this.props;

    const to = location.pathname.split('/')[1].toLowerCase() === 'identity' ? 'transfer' : 'identity';

    this.setState({ buttonText: camlizeInclusiveFirst(to) });

    history.push(`/${to}/${address}`);
  }

  render () {
    const { address, buttonText, name } = this.state;

    return (
      <StyledCard>
        <CardHeader>Current Account</CardHeader>
        <CardContent>
          <AddressSummary address={address} balance={new BN(10000)} name={name} />
          <Address address={address} />
          <NavButton value={buttonText} onClick={this.handleToggleApp} />
        </CardContent>
      </StyledCard>
    );
  }
}
