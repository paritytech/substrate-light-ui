// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  encodeAddress,
  mnemonicGenerate,
  mnemonicToMiniSecret,
  naclKeypairFromSeed,
} from '@polkadot/util-crypto';
import { ApiRxContext } from '@substrate/context';
import {
  AddressSummary,
  MnemonicRandomWord,
  Paragraph,
  SizeType,
} from '@substrate/ui-components';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { InjectedContext } from '../../../../components/context';
import { assertIsDefined } from '../../../../util/assert';
import { AddAccountStepMeta } from '../shared/StepMeta';
import { AddAccountStepMnemonic } from './StepMnemonic';
import { AddAccountStepRewrite, randomlyPickFour } from './StepRewrite';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}

/**
 * Derive public address from mnemonic key.
 */
function generateAddressFromMnemonic(mnemonic: string): string {
  const keypair = naclKeypairFromSeed(mnemonicToMiniSecret(mnemonic));

  return encodeAddress(keypair.publicKey);
}

export function Create(props: Props): React.ReactElement {
  const { history } = props;

  const { api } = useContext(ApiRxContext);
  const { messaging } = useContext(InjectedContext);

  // User inputs
  const [mnemonic, setMnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0);

  const [error, setError] = useState('');

  // Derived state
  const [address, setAddress] = useState('');
  const [randomFourWords, setRandomFourWords] = useState<MnemonicRandomWord[]>(
    []
  );

  useEffect(() => {
    const address = generateAddressFromMnemonic(mnemonic);
    // pick random four from the mnemonic to make sure user copied it right
    const randomFour = randomlyPickFour(mnemonic);

    setAddress(address);
    setRandomFourWords(randomFour);
  }, [mnemonic]);

  const goToNextStep = (): void => {
    setError('');

    if (step < 2) {
      setStep(step + 1);
    } else {
      assertIsDefined(
        messaging,
        "We wouldn't be creating an account if there was no injected messaging. qed."
      );

      messaging
        .createAccountSuri(name, password, mnemonic)
        .then(() => history.push('/'))
        .catch((error) => setError(error.message));
    }
  };

  const goToPreviousStep = (): void => {
    setError('');

    if (step > 0) {
      setStep(step - 1);
    }
  };

  const setNewMnemonic = useCallback(() => setMnemonic(mnemonicGenerate()), []);

  function renderStep(step: number): React.ReactElement {
    switch (step) {
      case 0:
        return (
          <AddAccountStepMnemonic
            mnemonic={mnemonic}
            goToNextStep={goToNextStep}
            setNewMnemonic={setNewMnemonic}
          />
        );
      case 1:
        return (
          <AddAccountStepRewrite
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            randomFourWords={randomFourWords}
            setError={setError}
          />
        );
      case 2:
        return (
          <AddAccountStepMeta
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            name={name}
            password={password}
            setName={setName}
            setPassword={setPassword}
            setError={setError}
          />
        );
      default:
        throw new Error(`CreateAccount: Cannot get to step ${step}. qed.`);
    }
  }

  return (
    <>
      <div className='absolute left-1 top-2'>
        <AddressSummary
          address={address}
          api={api}
          name={name}
          noBalance
          noPlaceholderName
          orientation='vertical'
          size='small'
        />
      </div>
      {error && <Paragraph status='error'>{error}</Paragraph>}
      {renderStep(step)}
    </>
  );
}
