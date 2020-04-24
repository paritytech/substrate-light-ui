// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Card, Header } from './index';

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
      <Header margin='large'> {header} </Header>
      <Header as='h3' margin='large'>
        {subheader}
      </Header>
      {children}
    </Card>
  );
}
