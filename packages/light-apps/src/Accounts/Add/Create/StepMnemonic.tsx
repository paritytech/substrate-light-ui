// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  FadedText,
  MnemonicPhraseList,
  NavButton,
  Stacked,
  StyledNavButton,
  SubHeader,
} from '@substrate/ui-components';
import React from 'react';

interface Props {
  goToNextStep: () => void;
  mnemonic: string;
  setNewMnemonic: () => void;
}

export function AddAccountStepMnemonic(props: Props): React.ReactElement {
  const { mnemonic, goToNextStep, setNewMnemonic } = props;

  return (
    <Stacked>
      <StyledNavButton onClick={setNewMnemonic}>
        Generate new mnemonic
      </StyledNavButton>
      <SubHeader>Copy the following mnemonic phrase</SubHeader>
      <FadedText>
        Your private key will be generated from this phrase. Anyone with access
        to this phrase can have full control your funds so make sure to keep it
        a secure and secret.
      </FadedText>
      <MnemonicPhraseList phrase={mnemonic} />
      <NavButton onClick={goToNextStep}>Next</NavButton>
    </Stacked>
  );
}
