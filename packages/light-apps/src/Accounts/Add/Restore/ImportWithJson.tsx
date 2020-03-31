// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, handler } from '@substrate/context';
import {
  ErrorText,
  Input,
  InputFile,
  Margin,
  NavButton,
  Stacked,
  SubHeader,
  WrapperDiv,
} from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps;

type Step = 'upload' | 'password';

export function ImportWithJson(props: Props): React.ReactElement {
  const { history } = props;
  const { enqueue } = useContext(AlertsContext);

  const [errorText, setErrorText] = useState<string>();
  const [step, setStep] = useState('upload' as Step);
  const [inputPassword, setInputPassword] = useState('');
  const [jsonString, setJsonString] = useState('');

  const handleFileUploaded = (file: string | null): void => {
    try {
      if (!file) {
        throw new Error(
          'File was empty. Make sure you uploaded the correct file and try again.'
        );
      }

      setJsonString(file);
      setStep('password');

      window.alert('FIXME handleFileUploaded');
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error',
      });
    }
  };

  const handleRestoreWithJson = (): void => {
    window.alert('FIXME handleRestoreWithJson');
  };

  return (
    <Stacked>
      <SubHeader> Restore Account from JSON Backup File </SubHeader>
      {step === 'upload' ? (
        <InputFile onChange={handleFileUploaded} />
      ) : (
        <>
          <WrapperDiv>
            <Input
              fluid
              label='Password'
              onChange={handler(setInputPassword)}
              type='password'
            />
            <Margin top />
          </WrapperDiv>
          <Margin top />
          <ErrorText>{errorText}</ErrorText>
          <NavButton onClick={handleRestoreWithJson} value='Restore' />
        </>
      )}
    </Stacked>
  );
}
