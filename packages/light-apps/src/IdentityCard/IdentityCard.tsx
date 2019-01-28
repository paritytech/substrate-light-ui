// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import BN from 'bn.js';

import { Address, AddressSummary, NavButton } from '@polkadot/ui-components';
import { RouteComponentProps } from 'react-router-dom';

import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';

type Props = RouteComponentProps & {
  address?: string,
  to: string,
  name?: string
};

type State = {
  buttonText: string
};

// FIXME: balance should come from LightAPI HOC's observables
export class IdentityCard extends React.Component<Props, State> {
  state: State = {
    buttonText: 'Identity'
  };

  handleChangeApp = () => {
    const { address, history, to } = this.props;

    this.setState({ buttonText: to === 'Identity' ? 'Transfer' : 'Identity' });

    history.push(`${to}/${address}`);
  }

  render () {
    const { address, name } = this.props;
    const { buttonText } = this.state;

    return (
      <StyledCard>
        <CardHeader>Current Account</CardHeader>
        <CardContent>
          <AddressSummary address={address} balance={new BN(10000)} name={name} />
          <Address address={address} />
          <NavButton value={buttonText} onClick={this.handleChangeApp} />
        </CardContent>
      </StyledCard>
    );
  }
}
