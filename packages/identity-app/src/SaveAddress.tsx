// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { ErrorText, Input, Margin, NavButton, Stacked, SubHeader, SuccessText, WalletCard, WithSpace } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {}

type State = {
  error: string | null,
  lookupAddress: string,
  name: string,
  success: string | null
};

export class AddressBook extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    lookupAddress: '',
    name: '',
    success: null
  };

  handleInputAddressLookup = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lookupAddress: value });
  }

  handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  handleSaveAddress = () => {
    const { keyring } = this.context;
    const { history, match: { params: { currentAccount } } } = this.props;
    const { name, lookupAddress } = this.state;

    try {
      // if address already saved under this name: throw
      const address = keyring.getAddress(lookupAddress);
      if (address && address.getMeta().name === name) {
        throw new Error('This address has already been saved under this name.');
      }

      // If the lookupaddress is already saved, just update the name
      keyring.saveAddress(lookupAddress, { name });

      this.onSuccess('Successfully saved address');

      // short lag time to show the address being added before redirecting
      setTimeout(() => history.push(`/transfer/${currentAccount}/${lookupAddress}`), 500);
    } catch (e) {
      this.onError(e.message);
    }
  }

  onError = (value: string | null) => {
    this.setState({ error: value, success: null });
  }

  onSuccess = (value: string | null) => {
    this.setState({ error: null, success: value });
  }

  render () {
    const { lookupAddress, name } = this.state;

    return (
      <WalletCard
        header='Save Address'
        subheader='Inspect the status of any identity and name it for later use' >
        <Margin top />
        <Stacked>
          <WithSpace>
            <SubHeader> Save Address </SubHeader>
            <Input
              label='Address'
              onChange={this.handleInputAddressLookup}
              type='text'
              value={lookupAddress}
            />
            <Margin top />
            <Input
              label='Name'
              onChange={this.handleInputName}
              type='text'
              value={name}
            />
          </WithSpace>
          <NavButton onClick={this.handleSaveAddress} value='Save Address' />
          { this.renderError() }
          { this.renderSuccess() }
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

  renderSuccess () {
    const { success } = this.state;

    return (
      <SuccessText>
        {success || null}
      </SuccessText>
    );
  }
}
