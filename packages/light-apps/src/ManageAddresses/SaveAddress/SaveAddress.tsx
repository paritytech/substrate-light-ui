// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isFunction } from '@polkadot/util';
import React from 'react';
import { AppContext } from '@substrate/ui-common';
import { ErrorText, Form, Input, Margin, NavButton, Stacked, SuccessText, WrapperDiv } from '@substrate/ui-components';

interface Props {
  addressDisabled?: boolean;
  defaultAddress?: string;
  onSave?: () => void;
}

type State = {
  address: string,
  error?: string,
  name: string,
  success?: string
};

export class SaveAddress extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    address: this.props.defaultAddress || '',
    name: ''
  };

  componentDidMount () {
    const name = this.getName(this.props.defaultAddress);
    if (name) {
      this.setState({ name: name });
    }
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.defaultAddress && prevProps.defaultAddress !== this.props.defaultAddress) {
      const name = this.getName(this.props.defaultAddress) || '';
      this.setState({
        address: this.props.defaultAddress,
        error: undefined,
        name,
        success: undefined
      });
    }
  }

  getName = (address?: string) => {
    if (!address) {
      return;
    }

    const { keyring } = this.context;

    return keyring.getAddress(address).getMeta().name;
  }

  handleInputAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ address: value });
  }

  handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  handleSubmit = () => {
    const { keyring } = this.context;
    const { onSave } = this.props;
    const { address, name } = this.state;

    try {
      // if address already saved under this name: throw
      const lookupAddress = keyring.getAddress(address);
      try {
        if (lookupAddress && lookupAddress.getMeta().name === name) {
          throw new Error('This address has already been saved under this name.');
        }
      } catch (_error) {
        /* Do nothing */
      }

      // If the address is already saved, just update the name
      keyring.saveAddress(address, { name });

      this.onSuccess(lookupAddress
        ? 'Successfully edited existing address'
        : 'Successfully saved address');

      if (isFunction(onSave)) {
        onSave();
      }
    } catch (e) {
      this.onError(e.message);
    }
  }

  onError = (value: string) => {
    this.setState({ error: value, success: undefined });
  }

  onSuccess = (value: string) => {
    this.setState({ error: undefined, success: value });
  }

  render () {
    const { addressDisabled } = this.props;
    const { address, name } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Stacked>
          <WrapperDiv>
            <Input
              disabled={addressDisabled}
              fluid
              label='Address'
              onChange={this.handleInputAddress}
              required
              placeholder='e.g. 5ErZS1o.....'
              type='text'
              value={address}
            />
            <Margin top />
            <Input
              fluid
              label='Name'
              onChange={this.handleInputName}
              required
              type='text'
              value={name}
            />
            <Margin top />
            <NavButton type='submit' value='Save Address' />
            {this.renderError()}
            {this.renderSuccess()}
          </WrapperDiv>
        </Stacked>
      </Form>
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
