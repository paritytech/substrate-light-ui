// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import IdentityIcon from '@polkadot/ui-identicon';

type Props = {
  address: string
};

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address } = this.props;

    return (
      <IdentityIcon value={address} theme={'substrate'} size={64}/>
    );
  }
}
