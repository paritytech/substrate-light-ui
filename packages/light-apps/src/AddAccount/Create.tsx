// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate } from '@polkadot/util-crypto';
import { AppContext, handler } from '@substrate/ui-common';
import { AddressSummary, Dropdown, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, SizeType, Stacked, StyledLinkButton, SubHeader, WrapperDiv, WithSpaceAround, StyledNavButton } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Steps, Tags, TagOptions, UserInputError } from './types';
import { generateAddressFromMnemonic, validate } from './util';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}

export function Create (props: Props) {
  const { identiconSize } = props;

  const { keyring } = useContext(AppContext);

  const [errors, setErrors] = useState<Option<Array<string>>>(none);
  const [mnemonic, setMnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rewritePhrase, setRewritePhrase] = useState('');
  const [step, setStep] = useState<Steps>('copy');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' }
  ]);
  const [tags, setTags] = useState<Tags>([]);

  const address = generateAddressFromMnemonic(keyring, mnemonic);
  const validation = validate({ mnemonic, name, password, rewritePhrase, tags }, step);

  const createNewAccount = () => {
    validation.fold(
      (err) => { onError(err); },
      (values) => {
        // keyring.createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType).address;
        // keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
        const result = keyring.addUri(values.mnemonic.trim(), values.password,
          {
            name: values.name,
            tags: values.tags
          });

        const json = result.json;
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${values.name}-${result.pair.address}.json`);
      }
    );
  };

  const onError = (err: UserInputError) => {
    setErrors(some(Object.values(err)));
  };

  const goToNextStep = () => {
    setErrors(none);

    validation.fold(
      (err) => onError(err),
      () => step === 'copy'
              ? setStep('rewrite')
              : step === 'rewrite'
                ? setStep('meta')
                : setErrors(none)
    );
  };

  const goToPreviousStep = () => {
    setErrors(none);
    setStep('copy');
  };

  const handleOnChange = (event: React.SyntheticEvent, { value }: any) => {
    setTags(value);
  };

  const handleAddTag = (e: React.SyntheticEvent, { value }: any) => {
    setTagOptions([...tagOptions, { key: value, text: value, value }]);
  };

  return (
    <Stacked>
      <AddressSummary address={address} name={name} size={identiconSize} />
      <Margin top />
      {step === 'copy'
        ? renderCreateStep({ mnemonic }, { setMnemonic }, goToNextStep)
        : step === 'rewrite'
          ? renderRewriteStep({ mnemonic, rewritePhrase }, { setRewritePhrase, goToPreviousStep, goToNextStep })
          : renderMetaStep({ name, password, tags, tagOptions }, { setName, setPassword, handleAddTag, handleOnChange, createNewAccount, goToPreviousStep })
      }
      {renderErrors(errors)}
    </Stacked>
  );
}

function renderMetaStep (
  values: {
    name: string,
    password: string,
    tags: Tags,
    tagOptions: TagOptions
  },
  setters: {
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    handleAddTag: (event: React.SyntheticEvent, data: any) => void, // FIXME any
    handleOnChange: (event: React.SyntheticEvent, data: any) => void, // FIXME any
    createNewAccount: () => void,
    goToPreviousStep: () => void
  }) {
  const { name, password, tags, tagOptions } = values;
  const { handleAddTag, handleOnChange, setName, setPassword } = setters;
  const { createNewAccount, goToPreviousStep } = setters;

  const renderSetTags = () => {
    return (
      <Stacked>
        <SubHeader noMargin>Add Tags:</SubHeader>
        <Dropdown
          allowAdditions
          closeOnChange
          fluid
          multiple
          onAddItem={handleAddTag}
          onChange={handleOnChange}
          options={tagOptions}
          search
          selection
          value={tags} />
        <WithSpaceAround>
        <Stacked>
          <StyledLinkButton onClick={goToPreviousStep}> Back </StyledLinkButton>
          <Margin top />
          <NavButton onClick={createNewAccount}> Save </NavButton>
        </Stacked>
      </WithSpaceAround>
      </Stacked>
    );
  };

  return (
    <WrapperDiv margin='0'>
        {renderSetName(name, setName)}
        <Margin top='small' />
        {renderSetPassword(password, setPassword)}
        <Margin top='small' />
        {renderSetTags()}
      </WrapperDiv>
  );
}

function renderCreateStep (
  values: {
    mnemonic: string
  },
  setters: {
    setMnemonic: React.Dispatch<React.SetStateAction<string>>
  },
  goToNextStep: () => void
) {
  const { mnemonic } = values;
  const { setMnemonic } = setters;

  /*
    3 steps:
      1 - copy mnemonic
      2 - rewrite mnemonic
      3 - meta and password
  */
  return (
    <Stacked>
      <SubHeader> Create from the following mnemonic phrase `</SubHeader>
      <Stacked>
        <MnemonicSegment onClick={() => setMnemonic(mnemonicGenerate())} mnemonic={mnemonic} />
      </Stacked>
      <NavButton onClick={goToNextStep}> Next </NavButton>
    </Stacked>
  );
}

function renderErrors (errors: Option<Array<string>>) {
  return errors.fold(null, errStrings => errStrings.map(err => <ErrorText>{err}</ErrorText>));
}

function renderRewriteStep (
  values: {
    mnemonic: string,
    rewritePhrase: string
  },
  setters: {
    setRewritePhrase: React.Dispatch<React.SetStateAction<string>>,
    goToPreviousStep: () => void,
    goToNextStep: () => void
  }

) {
  const { rewritePhrase } = values;
  const { goToNextStep, goToPreviousStep, setRewritePhrase } = setters;

  return (
    <Stacked>
      <SubHeader> Copy Your Mnemonic Somewhere Safe </SubHeader>
      <FadedText> If someone gets hold of this mnemonic they could drain your account</FadedText>
      <Margin top />
      <FadedText> Rewrite Mnemonic Below </FadedText>
      <Input
        autoFocus
        fluid
        onChange={handler(setRewritePhrase)}
        type='text'
        value={rewritePhrase} />
      <WithSpaceAround>
        <Stacked>
          <StyledLinkButton onClick={goToPreviousStep}> Back </StyledLinkButton>
          <Margin top />
          <StyledNavButton onClick={goToNextStep}>Next</StyledNavButton>
        </Stacked>
      </WithSpaceAround>
    </Stacked>
  );
}

function renderSetName (name: string, setName: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <Stacked>
      <SubHeader noMargin> Give it a name </SubHeader>
      <Input
        autoFocus
        fluid
        min={1}
        onChange={handler(setName)}
        type='text'
        value={name}
      />
    </Stacked>
  );
}

function renderSetPassword (password: string, setPassword: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <Stacked>
      <SubHeader noMargin> Encrypt it with a passphrase </SubHeader>
        <Input
          fluid
          min={8}
          onChange={handler(setPassword)}
          type='password'
          value={password}
        />
    </Stacked>
  );
}
