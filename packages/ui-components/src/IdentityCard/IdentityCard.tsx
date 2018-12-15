// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Card } from 'semantic-ui-react';
import { AccountAddress } from '@polkadot/ui-components';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 15rem;
  min-width: 100%;
  border: 2px solid black;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
`;

const CardHeader = styled(Card.Header)`
  text-align: center;
  font-weight: 300;
  font-size: 28px;
  padding: 1.2rem 0;
`;

const CardContent = styled(Card.Content)`
  display: flex;
  justify-items: center;
  align-items: space-between;
  padding: 0 1rem;
  width: 100%;
`;

export class IdentityCard extends React.PureComponent {
  render () {
    return (
      <StyledCard>
        <CardHeader>Accounts</CardHeader>
        <CardContent>
          <AccountAddress address={'7qroA7r5Ky9FHN5mXA2GNxZ79ieStv4WYYjYe3m3XszK9SvF'} />
        </CardContent>
      </StyledCard>
    );
  }
}
