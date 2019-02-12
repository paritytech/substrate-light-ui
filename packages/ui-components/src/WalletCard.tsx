// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';

import { Card, Header, SubHeader, Stacked, WithSpaceAround } from './index';

type Props = {
  children: React.ReactNode,
  header: string,
  subheader?: string,
  overflow?: string
};

class WalletCard extends React.PureComponent<Props> {
  render () {
    const { children, header, overflow = 'none', subheader } = this.props;

    return (
      <Card raised overflow={overflow}>
        <WithSpaceAround>
          <Stacked>
            <Header margin='0.2rem 0'> {header} </Header>
            <SubHeader margin='0rem auto'> {subheader} </SubHeader>
            <Stacked justify='flex-start' textAlign='left'>
              {children}
            </Stacked>
          </Stacked>
        </WithSpaceAround>
      </Card>
    );
  }
}

export default WalletCard;
