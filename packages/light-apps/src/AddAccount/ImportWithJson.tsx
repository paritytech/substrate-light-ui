// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, AppContext, handler } from '@substrate/ui-common';
import { Input, InputFile, Margin, NavButton, Stacked, SubHeader, WrapperDiv } from '@substrate/ui-components';
import React, { useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

type Step = 'upload' | 'password';

interface Props extends RouteComponentProps { }

export function ImportWithJson (props: Props) {
  const { history } = props;

  const { enqueue } = useContext(AlertsContext);
  const { keyring } = useContext(AppContext);

  const [step, setStep] = useState('upload' as Step);
  const [inputPassword, setInputPassword] = useState('');
  const [jsonString, setJsonString] = useState('');

  const handleFileUploaded = async (file: string | null) => {
    try {
      if (!file) {
        throw new Error('File was empty. Make sure you uploaded the correct file and try again.');
      }

      setJsonString(file);
      setStep('password');
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error'
      });
    }
  };

  const handleRestoreWithJson = () => {

    try {
      const json = JSON.parse(jsonString);

      let pair = keyring.restoreAccount(json, inputPassword);

      history.push(`/transfer/${pair.address()}`);
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error'
      });
    }
  };

  return (
    <Stacked>
      <SubHeader> Restore Account from JSON Backup File </SubHeader>
      {
        step === 'upload'
          ? <InputFile onChange={handleFileUploaded} />
          : (
            <React.Fragment>
              <WrapperDiv>
                <Input
                  fluid
                  label='Password'
                  onChange={handler(setInputPassword)}
                  type='password' />
              </WrapperDiv>
              <Margin top />
              <NavButton onClick={handleRestoreWithJson} value='Restore' />
            </React.Fragment>
          )
      }
    </Stacked>
  );
}
