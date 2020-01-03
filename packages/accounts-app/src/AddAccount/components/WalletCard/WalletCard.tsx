// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card, Header, Stacked, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';

type WalletCardProps = {
  children: React.ReactNode;
  header: string;
  height?: string;
  subheader?: string;
  overflow?: string;
};

export function WalletCard(props: WalletCardProps): React.ReactElement {
  const { children, header, height, overflow = 'none', subheader } = props;

  return (
    <Card height={height} raised overflow={overflow}>
      <WithSpaceAround>
        <Stacked>
          <Header margin='large'> {header} </Header>
          <SubHeader margin='large'> {subheader} </SubHeader>
          <Stacked>{children}</Stacked>
        </Stacked>
      </WithSpaceAround>
    </Card>
  );
}
