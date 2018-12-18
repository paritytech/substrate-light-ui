// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import BN from 'bn.js';

import Address from '../Address';
import AddressSummary from '../AddressSummary';
import NavButton from '../NavButton';
import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';

type Props = {
  value: string,
  to: string,
  address: string
};

// TODO: balance and name props should come from LightAPI HOC's observables

export class IdentityCard extends React.PureComponent<Props> {
  render () {
    const { address, to, value } = this.props;

    return (
      <StyledCard>
        <CardHeader>Current Account</CardHeader>
        <CardContent>
          <AddressSummary address={address} balance={new BN(10000)} name={'Alice'} />
          <Address address={address} />
          <NavButton to={to} value={value} />
        </CardContent>
      </StyledCard>
    );
  }
}
