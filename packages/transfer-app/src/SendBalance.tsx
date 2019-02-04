// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Grid, Input, MarginTop, Stacked, SubHeader, WalletCard } from '@polkadot/ui-components';

import React from 'react';

type Props = {
  basePath: string;
};

type State = {
  recipientAddress?: string
};

export class SendBalance extends React.PureComponent<Props, State> {
  state: State = {};

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recipientAddress: value
    });
  }

  render () {
    const { recipientAddress } = this.state;

    return (
      <WalletCard
        header='Transfer balance'
        subheader='Send balance of the currency of the current chain to a select account'>
        <MarginTop />
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Stacked>
                <SubHeader> Recipient </SubHeader>
                <MarginTop />
                <AddressSummary address={recipientAddress} size={32} />
                <MarginTop />
                <Input onChange={this.onChangeRecipientAddress} type='text' value={recipientAddress} />
              </Stacked>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </WalletCard>
    );
  }
}
