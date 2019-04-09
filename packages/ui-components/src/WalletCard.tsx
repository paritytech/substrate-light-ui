// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';

import { Card, Header, SubHeader, Stacked, WithSpaceAround } from './index';

type Props = {
  children: React.ReactNode,
  header: string,
  height?: string,
  subheader?: string,
  overflow?: string
};

export class WalletCard extends React.PureComponent<Props> {
  render () {
    const { children, header, height, overflow = 'none', subheader } = this.props;

    return (
      <Card height={height} raised overflow={overflow}>
        <WithSpaceAround>
          <Stacked>
            <Header margin='large'> {header} </Header>
            <SubHeader margin='large'> {subheader} </SubHeader>
            <Stacked>
              {children}
            </Stacked>
          </Stacked>
        </WithSpaceAround>
      </Card>
    );
  }
}
