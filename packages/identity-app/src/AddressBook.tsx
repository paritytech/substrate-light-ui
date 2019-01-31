// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Container, ErrorText, Input, MarginTop, NavButton, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  basePath: string;
}

type State = {
  error: string | null,
  lookupAddress: string,
  name: string
};

export class AddressBook extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    lookupAddress: '',
    name: ''
  };

  private handleInputAddressLookup = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lookupAddress: value });
  }

  private handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  private handleSaveAccountExternal = () => {
    const { name, lookupAddress } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it:
    try {
      if (keyring.getAddress(lookupAddress)) {
        this.onError("You've already saved this address");
      }

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
          {this.renderError()}
        </Stacked>
      </WalletCard>
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
