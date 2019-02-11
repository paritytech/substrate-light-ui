// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, Input, MarginTop, Modal, NavButton, NavLink, Stacked } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

type State = {
  error?: string;
  recoveryPhrase: string;
};

export class ImportWithPhrase extends React.PureComponent<Props> {
  state: State = {
    recoveryPhrase: ''
  };

  private handleUnlockWithPhrase = () => {
    const { recoveryPhrase } = this.state;
    const { history } = this.props;

    try {
      if (recoveryPhrase && recoveryPhrase.split(' ').length === 12) {
        const nextLocation = {
          pathname: '/save/withPhrase',
          state: { recoveryPhrase }
        };

        history.push(nextLocation);
      } else {
        this.onError('The phrase you entered is not valid. Please check it and try again.');
      }
    } catch (e) {
      this.onError(e.message);
    }
  }

  private onError = (value: string) => {
    this.setState({
      error: value
    });
  }

  private onChangePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  render () {
    const { recoveryPhrase } = this.state;

    return (
      <React.Fragment>
        <Stacked>
          <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
          <Input
            onChange={this.onChangePhrase}
            type='text'
            value={recoveryPhrase} />
          <Modal.Actions>
            <Stacked>
              <NavButton onClick={this.handleUnlockWithPhrase}>Unlock</NavButton>
              <MarginTop />
              <Modal.Actions>
                <Stacked>
                  <NavLink to='/import/withJson'> Import with JSON Instead </NavLink>
                  <Modal.FadedText>or</Modal.FadedText>
                  <NavLink to='/create'> Create New Account </NavLink>
                </Stacked>
              </Modal.Actions>
            </Stacked>
          </Modal.Actions>
          {this.renderError()}
        </Stacked>
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
