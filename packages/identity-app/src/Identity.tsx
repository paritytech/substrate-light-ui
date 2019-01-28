// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Container, Input, MarginTop, NavButton, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

interface Props extends RouteComponentProps {
  basePath: string;
}

type State = {
  recoveryPhrase?: string,
  name?: string,
  lookupAddress?: string
};

export class Identity extends React.Component<Props, State> {
  state: State = {};

  private handleAddAccount = () => {
    const { name, recoveryPhrase } = this.state;

    console.log(name, recoveryPhrase);
  }

  private handleInputAddressLookup = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lookupAddress: value });
  }

  private handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  private handleInputRecoveryPhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recoveryPhrase: value });
  }

  private handleSaveAccount = () => {
    const { name, lookupAddress } = this.state;

    console.log(name, lookupAddress);
  }

  render () {
    return (
      <Container>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <WalletCard
                header='Wallet'
                subheader='Manage your secret keys' >
                <Stacked>
                  <WithSpace>
                    <Input
                      label='Recovery Phrase'
                      onChange={this.handleInputRecoveryPhrase}
                      type='text'
                      withLabel />
                    <MarginTop />
                    <Input
                      label='Name'
                      onChange={this.handleInputName}
                      type='text'
                      withLabel />
                  </WithSpace>
                  <NavButton onClick={this.handleAddAccount} value='Create Account' />
                </Stacked>
              </WalletCard>
            </Grid.Column>

            <Grid.Column>
              <WalletCard
                header='Address Book'
                subheader='Inspect the status of any account and name it for later use' >
                <Stacked>
                  <WithSpace>
                    <Input
                      label='Lookup Account By Address'
                      onChange={this.handleInputAddressLookup}
                      type='text'
                      withLabel
                    />
                    <MarginTop />
                    <Input
                      label='Name'
                      onChange={this.handleInputName}
                      type='text'
                      withLabel
                    />
                  </WithSpace>
                <NavButton onClick={this.handleSaveAccount} value='Unlock Account' />
                </Stacked>
              </WalletCard>
            </Grid.Column>

            <Grid.Column>
              <WalletCard
                header='Saved Accounts'
                subheader='To quickly move between accounts, select from the list of unlocked accounts below.'
                overflow='scroll'>
                <Stacked>
                  <WithSpace>
                    <React.Fragment>
                      {
                        this.renderAllAccountsFromKeyring()
                      }
                    </React.Fragment>
                  </WithSpace>
                </Stacked>
              </WalletCard>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  renderAllAccountsFromKeyring () {
    // FIXME: Only load keyring once in light-apps after light-api is set
    try {
      keyring.loadAll();
    } catch (e) {
      console.log(e);
    }

    return (
      <React.Fragment>
        {
          keyring.getPairs().map(pair => {
            return (
              <Grid.Row key={pair.address()}>
                <MarginTop />
                  <AddressSummary
                    address={pair.address()}
                    name={pair.getMeta().name}
                    orientation='horizontal'
                    size='small' />
              </Grid.Row>
            );
          })
        }
      </React.Fragment>
    );
  }
}
