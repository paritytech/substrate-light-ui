// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, Menu } from '@substrate/ui-components';
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

  toJsonScreen = () => {
    this.setState({
      screen: 'JSON'
    });
  }

  toPhraseScreen = () => {
    this.setState({
      screen: 'Phrase'
    });
  }

  render () {
    const { screen } = this.state;

    return (
      <React.Fragment>
        <Menu secondary>
          <Menu.Item active={screen === 'JSON'} onClick={this.toJsonScreen}> With JSON </Menu.Item>
          <Menu.Item active={screen === 'Phrase'} onClick={this.toPhraseScreen}> With Phrase </Menu.Item>
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
