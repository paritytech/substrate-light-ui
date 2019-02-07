// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { ErrorText, Input, MarginTop, NavButton, Stacked, SubHeader, SuccessText, WalletCard, WithSpace } from '@substrate/ui-components';
import React from 'react';

type Props = {
  basePath: string
};

type State = {
  error: string | null,
  lookupAddress: string,
  name: string,
  success: string | null
};

export class AddressBook extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    lookupAddress: '',
    name: '',
    success: null
  };

  private handleInputAddressLookup = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lookupAddress: value });
  }

  private handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  private handleSaveAccount = () => {
    const { keyring } = this.context;
    const { name, lookupAddress } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it:
    try {
      if (keyring.getAddress(lookupAddress)) {
        this.onError("You've already saved this address");
      }

      keyring.saveAddress(lookupAddress, { name });

      this.onSuccess('Successfully saved address');
    } catch (e) {
      this.onError(e.message);
    }
  }

  private onError = (value: string | null) => {
    this.setState({ error: value, success: null });
  }

  private onSuccess = (value: string | null) => {
    this.setState({ error: null, success: value });
  }

  render () {
    return (
      <WalletCard
        header='Address Book'
        subheader='Inspect the status of any identity and name it for later use' >
        <MarginTop />
        <Stacked>
          <WithSpace>
            <SubHeader> Lookup Account By Address </SubHeader>
            <Input
              onChange={this.handleInputAddressLookup}
              type='text'
            />
            <MarginTop />
            <SubHeader> Name </SubHeader>
            <Input
              onChange={this.handleInputName}
              type='text'
            />
          </WithSpace>
          <NavButton onClick={this.handleSaveAccount} value='Save Identity' />
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
