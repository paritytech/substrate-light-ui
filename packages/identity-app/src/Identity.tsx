// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Container, Input, MarginTop, NavButton, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

interface Props extends RouteComponentProps {
  basePath: string;
}

type State = {
  error: string | null,
  lookupAddress?: string,
  name?: string,
  recoveryPhrase?: string
};

export class Identity extends React.Component<Props, State> {
  state: State = {};

  componentWillMount () {
    // FIXME: Only load keyring once after light-api is set
    try {
      keyring.loadAll();
    } catch (e) {
      console.log(e);
    }
  }

  private handleAddAccount = () => {
    const { name, recoveryPhrase } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it (need to unlock first)
    try {
      const pair = keyring.createAccountMnemonic(recoveryPhrase, { name, isExternal: true });
      console.log(pair);
    } catch (e) {
      this.onError(e.message);
    }
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

  private handleSaveAccountExternal = () => {
    const { name, lookupAddress } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it:
    try {
      keyring.saveAddress(lookupAddress, { name, isExternal: true });
    } catch (e) {
      this.onError(e.message);
    }
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
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
                <NavButton onClick={this.handleSaveAccountExternal} value='Save External Account' />
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
                      { this.renderAllAccountsFromKeyring() }
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
    return (
      <React.Fragment>
        {
          keyring.getPairs().map(pair => {
            return (
              <React.Fragment key={pair.address()}>
                <MarginTop />
                <Link to={`/identity/${pair.address()}`}>
                  <Grid.Row>
                    <AddressSummary
                      address={pair.address()}
                      name={pair.getMeta().name}
                      orientation='horizontal'
                      size='small' />
                  </Grid.Row>
                </Link>
              </React.Fragment>
            );
          })
        }
      </React.Fragment>
    );
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error || null}
      </ErrorText>
    );
  }
}
