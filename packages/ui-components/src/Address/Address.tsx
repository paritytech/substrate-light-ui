// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import CopyButton from '../CopyButton';
import Segment from '../Segment';

import { AddressContainer } from './Address.styles';
import { NavLinkSmall } from '../Shared.styles';

type Props = {
  address: string,
  goToRoute: (to?: string) => void
};

export class Address extends React.PureComponent<Props> {
  render () {
    const { address, goToRoute } = this.props;

    return (
      <AddressContainer>
        <Segment>
          {address}
          <CopyButton value={address} />
        </Segment>
        <React.Fragment>
          <NavLinkSmall onClick={() => goToRoute('Forget')}> Forget </NavLinkSmall>
          or
          <NavLinkSmall onClick={() => goToRoute('Backup')}> Backup </NavLinkSmall>
        </React.Fragment>
      </AddressContainer>
    );
  }
}
