// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Container, Grid, Input, MarginTop, Stacked, SubHeader, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  basePath: string;
}

type State = {
  recipientAddress?: string
};

export class Transfer extends React.PureComponent<Props, State> {
  state: State = {};

  componentWillMount () {
    // FIXME: Only load keyring once after light-api is set
    try {
      keyring.loadAll();
    } catch (e) {
      console.log(e);
    }
  }

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recipientAddress: value
    });
  }

  render () {
    const { recipientAddress } = this.state;

    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
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
            </Grid.Column>

            <Grid.Column width={6}>
              <WalletCard
                header='External Accounts'
                overflow='scroll'
                subheader='Quickly select an external account you have previously saved to transfer balance to'>
                <Stacked>
                  <WithSpace>
                      { this.renderAllExternalAccountsFromKeyring() }
                  </WithSpace>
                </Stacked>
              </WalletCard>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  renderAllExternalAccountsFromKeyring () {
    return (
      <React.Fragment>
        {
          keyring.getPairs().filter(pair => pair.getMeta().isExternal).map(pair => {
            return (
              <React.Fragment key={pair.address()}>
                <MarginTop />
                <Link to={`/identity/${pair.address()}`}>
                  <AddressSummary
                    address={pair.address()}
                    name={pair.getMeta().name}
                    orientation='horizontal'
                    size='small' />
                </Link>
              </React.Fragment>
            );
          });
        }
      </React.Fragment>
    );
  }
}
