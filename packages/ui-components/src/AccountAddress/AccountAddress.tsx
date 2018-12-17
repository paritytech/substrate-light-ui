// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUISegment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import styled from 'styled-components';

type Props = {
  address: string
};

const Segment = styled(SUISegment)`
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #fdfefe;
`;

export class AccountAddress extends React.PureComponent<Props> {
  render () {
    const { address } = this.props;

    return (
      <Segment>{address}</Segment>
    );
  }
}
