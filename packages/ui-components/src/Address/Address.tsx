// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import CopyButton from '../CopyButton';

type Props = {
  address?: string
};

const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export class Address extends React.PureComponent<Props> {
  render () {
    const { address } = this.props;

    return (
      <React.Fragment>
        {address || PLACEHOLDER_ADDRESS}
        <CopyButton value={address} />
      </React.Fragment>
    );
  }
}
