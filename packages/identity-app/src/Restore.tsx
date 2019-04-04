// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, Menu, StyledLinkButton } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

interface Props extends RouteComponentProps { }

type State = {
  error: string,
  screen: 'JSON' | 'Phrase'
};

export class Restore extends React.PureComponent<Props> {
  state: State = {
    error: '',
    screen: 'JSON'
  };

  onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  toggleScreen = () => {
    this.setState({
      screen: this.state.screen === 'JSON' ? 'Phrase' : 'JSON'
    });
  }

  render () {
    const { screen } = this.state;

    return (
      <React.Fragment>
        <Menu>
          <StyledLinkButton onClick={this.toggleScreen}> With JSON </StyledLinkButton>
          <StyledLinkButton onClick={this.toggleScreen}> With Phrase </StyledLinkButton>
        </Menu>
        {
          screen === 'JSON'
            ? <ImportWithJson onError={this.onError} {...this.props} />
            : <ImportWithPhrase {...this.props} />
        }
        { this.renderError() }
      </React.Fragment>
    );
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }
}
