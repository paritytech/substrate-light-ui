// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, Input, NavButton, Stacked, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
}

type State = {
  error: string | null;
  name: string;
};

export class Edit extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    name: ''
  };

  componentDidMount () {
    const { keyring } = this.context;

    const name = keyring.getPair(this.props.address).getMeta().name;

    this.setState({
      name
    });
  }

  handleSubmit = () => {
    const { keyring } = this.context;
    const { name } = this.state;

    keyring.saveAccountMeta(keyring.getPair(this.props.address), { name: name });
  }

  onChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: value
    });
  }

  onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  render () {
    const { name } = this.state;
    const { address } = this.props;

    return (
      <Stacked>
        <AddressSummary address={address} name={name} />
        <WithSpaceAround>
          {this.renderSetName()}
          {this.renderKeyringCryptoType()}
          {this.renderError()}
          <NavButton onClick={this.handleSubmit} value={'Confirm'} />
        </WithSpaceAround>
      </Stacked>
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

  // Warning: this should not be edittable,
  // but may be useful to make it visible.
  renderKeyringCryptoType () {
    const { keyring } = this.context;
    const cryptoType = keyring.getPair(this.props.address).type;

    return (
      <Input
        disabled
        label={'Keypair Crypto Type'}
        value={cryptoType} />
    );
  }

  renderSetName () {
    const { name } = this.state;

    return (
      <Stacked>
        <SubHeader> Enter The Name You Wish To Give This Account </SubHeader>
        <Input
          autoFocus
          label={'Name'}
          min={1}
          onChange={this.onChangeName}
          type='text'
          value={name}
        />
      </Stacked>
    );
  }
}
