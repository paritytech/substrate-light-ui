// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { WalletCard, Container } from '@polkadot/ui-components';

type Props = {
  basePath: string;
};

type State = {};

export class Identity extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    return (
      <Container>
        <WalletCard raised>
          <WalletCard.Header> yo </WalletCard.Header>
          <WalletCard.Content>
          Hello
          </WalletCard.Content>
        </WalletCard>
      </Container>
    );
  }
}
