// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Input, InputFile, Margin, NavButton, Stacked, SubHeader, WrapperDiv } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

type State = {
  jsonString: string,
  password: string,
  step: 'upload' | 'password'
};

export class ImportWithJson extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>;

  state: State = {
    jsonString: '',
    password: '',
    step: 'upload'
  };

  handleFileUploaded = async (file: string | null) => {
    try {
      if (!file) {
        throw new Error('File was empty. Make sure you uploaded the correct file and try again.');
      }

      this.setState({
        jsonString: file,
        step: 'password'
      });
    } catch (e) {
      this.context.alertStore.enqueue({
        content: e.message,
        type: 'error'
      });
    }
  }

  handlePasswordChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: value
    });
  }

  handleRestoreWithJson = () => {
    const { alertStore, keyring } = this.context;
    const { jsonString, password } = this.state;
    const { history } = this.props;

    try {
      const json = JSON.parse(jsonString);

      let pair = keyring.restoreAccount(json, password);

      history.push(`/identity/${pair.address()}`);
    } catch (e) {
      alertStore.enqueue({
        content: e.message,
        type: 'error'
      });
    }
  }

  render () {
    const { step } = this.state;

    return (
      <Stacked>
        <SubHeader> Restore Account from JSON Backup File </SubHeader>
        {
          step === 'upload'
            ? <InputFile onChange={this.handleFileUploaded} />
            : (
              <React.Fragment>
                <WrapperDiv>
                  <Input
                    fluid
                    label='Password'
                    onChange={this.handlePasswordChange}
                    type='password' />
                </WrapperDiv>
                <Margin top />
                <NavButton onClick={this.handleRestoreWithJson} value='Restore' />
              </React.Fragment>
            )
        }
      </Stacked>
    );
  }
}
