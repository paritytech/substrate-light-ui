// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import CopyButton from '../CopyButton';
import Segment from '../Segment';

import { AddressContainer } from './Address.styles';

type Props = {
  address: string
};

export class Address extends React.PureComponent<Props> {
  render () {
    const { address } = this.props;

    return (
      <AddressContainer>
        <Segment>
          {address}
          <CopyButton value={address} />
        </Segment>
        <React.Fragment>
          <a href='/forget'> Forget </a>
          or
          <a href='/backup'> Backup </a>
        </React.Fragment>
      </AddressContainer>
    );
  }
}
