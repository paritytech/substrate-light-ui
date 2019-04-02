// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, Segment, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
}

type State = {
  address?: string;
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
        {this.renderSetName()}
        {this.renderKeyringCryptoSetting()}
        {this.renderError()}
        <NavButton onClick={this.handleSubmit} />
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
  renderKeyringCryptoSetting () {
    const { keyring } = this.context;
    const cryptoSetting = keyring.getPair(this.props.address).type;

    return (
      <Segment> {cryptoSetting} </Segment>
    );
  }

  renderSetName () {
    const { name } = this.state;

    return (
      <Stacked>
        <SubHeader> Enter The Name You Wish To Give This Account </SubHeader>
        <Input
          autoFocus
          min={1}
          onChange={this.onChangeName}
          type='text'
          value={name}
        />
      </Stacked>
    );
  }
}
