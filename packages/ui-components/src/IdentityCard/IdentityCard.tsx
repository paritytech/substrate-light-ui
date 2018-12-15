// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AccountAddress, NavButton } from '@polkadot/ui-components';

import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';

export class IdentityCard extends React.PureComponent {
  render () {
    return (
      <StyledCard>
        <CardHeader>Current Account</CardHeader>
        <CardContent>
          <AccountAddress address={'7qroA7r5Ky9FHN5mXA2GNxZ79ieStv4WYYjYe3m3XszK9SvF'} />
          <NavButton to={'/Identity'} value={'Manage Accounts'} />
        </CardContent>
      </StyledCard>
    );
  }
}
