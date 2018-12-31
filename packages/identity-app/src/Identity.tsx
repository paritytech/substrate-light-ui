// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Container, WalletCard } from '@polkadot/ui-components';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

type Props = RouteComponentProps & {
  basePath: string
};

type State = {
  seed?: string,
  name?: string,
  lookupAddress?: string
};

@(withRouter as any)
export class Identity extends React.PureComponent<Props, State> {
  state: State = {};

  _handleInputSeed = (value: string) => {
    this.setState({
      seed: value
    });
  }

  _handleInputName = (value: string) => {
    this.setState({
      name: value
    });
  }

  _handleAddAccount = () => {
    const { name, seed } = this.state;

    console.log(name, seed);
  }

  _handleInputAddressLookup = (value: string) => {
    this.setState({
      lookupAddress: value
    });
  }

  _handleSaveAccount = () => {
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
                header={'Wallet'}
                subheader={'manage your secret keys'}
                actionButtonValue={'Create Account'}
                firstInputLabel={'Seed'}
                handleFirstInput={this._handleInputSeed}
                secondInputLabel={'Name'}
                handleSecondInput={this._handleInputName}
                handleSubmit={this._handleAddAccount}
                />
            </Grid.Column>

            <Grid.Column>
              <WalletCard
                header={'Address Book'}
                subheader={'inspect the status of any account and name it for later use'}
                actionButtonValue={'Save Account'}
                firstInputLabel={'Lookup Account by Address'}
                handleFirstInput={this._handleInputAddressLookup}
                secondInputLabel={'Name'}
                handleSecondInput={this._handleInputName}
                handleSubmit={this._handleSaveAccount}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
