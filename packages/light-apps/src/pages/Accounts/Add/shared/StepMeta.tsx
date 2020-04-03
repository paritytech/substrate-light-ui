// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  Input,
  Margin,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  StyledNavButton,
  SubHeader,
  WithSpaceAround,
  WrapperDiv,
} from '@substrate/ui-components';
import React, { useCallback } from 'react';

interface Props {
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  name: string;
  password: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function AddAccountStepMeta(props: Props): React.ReactElement {
  const {
    goToNextStep,
    goToPreviousStep,
    name,
    password,
    setName,
    setPassword,
    setError,
  } = props;

  const handleGoToNextStep = useCallback(() => {
    if (!name || !password) {
      return setError('Please fill in all fields.');
    }

    goToNextStep && goToNextStep();
  }, [goToNextStep, name, password, setError]);

  return (
    <WrapperDiv margin='0'>
      <Stacked>
        <SubHeader noMargin>Give it a name</SubHeader>
        <Input
          autoFocus
          fluid
          min={1}
          onChange={handler(setName)}
          type='text'
          value={name}
        />
      </Stacked>
      <Margin top='small' />
      <Stacked>
        <SubHeader noMargin>Encrypt it with a passphrase</SubHeader>
        <Input
          fluid
          min={8}
          onChange={handler(setPassword)}
          type='password'
          value={password}
        />
      </Stacked>

      <WithSpaceAround>
        <StackedHorizontal>
          {goToPreviousStep && (
            <StyledLinkButton onClick={goToPreviousStep}>Back</StyledLinkButton>
          )}
          {goToNextStep && (
            <StyledNavButton onClick={handleGoToNextStep}>Next</StyledNavButton>
          )}
        </StackedHorizontal>
      </WithSpaceAround>
    </WrapperDiv>
  );
}
