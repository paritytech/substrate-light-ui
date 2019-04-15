// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { u8aToString } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { Input, InputFile, NavButton, Stacked, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  onError: (message: string) => void;
}

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

  handleFileUploaded = async (file: Uint8Array) => {
    const jsonString = u8aToString(file);

    this.setState({
      jsonString,
      step: 'password'
    });
  }

  handlePasswordChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: value
    });
  }

  handleRestoreWithJson = () => {
    const { keyring } = this.context;
    const { jsonString, password } = this.state;
    const { history, onError } = this.props;

    try {
      const json = JSON.parse(jsonString);

      let pair = keyring.restoreAccount(json, password);

      history.push(`/identity/${pair.address()}`);
    } catch (e) {
      onError(e.message);
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
                <Input onChange={this.handlePasswordChange} type='password' />
                <NavButton onClick={this.handleRestoreWithJson} value='Restore' />
              </React.Fragment>
            )
        }
      </Stacked>
    );
  }
}
