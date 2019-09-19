// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate } from '@polkadot/util-crypto';
import { AppContext, handler } from '@substrate/ui-common';
import { AddressSummary, Dropdown, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, SizeType, Stacked, StyledLinkButton, SubHeader, WrapperDiv, WithSpaceAround } from '@substrate/ui-components';
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
  const [step, setStep] = useState<Steps>('create');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' }
  ]);
  const [tags, setTags] = useState<Tags>([]);

  const address = generateAddressFromMnemonic(keyring, mnemonic);
  const validation = validate({ mnemonic, name, password, rewritePhrase, tags });

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
      (err) => (err.name || err.password || err.tags) ? onError(err) : setStep('rewrite'),
      () => setStep('rewrite')
    );
  };

  const goToPreviousStep = () => {
    setErrors(none);
    setStep('create');
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
      {step === 'create'
        ? renderCreateStep({ mnemonic, name, password, tagOptions, tags }, { setMnemonic, setName, setPassword, handleAddTag, handleOnChange }, goToNextStep)
        : renderRewriteStep({ mnemonic, rewritePhrase }, { setRewritePhrase }, createNewAccount, goToPreviousStep)
      }
      {renderErrors(errors)}
    </Stacked>
  );
}

function renderCreateStep (
  values: {
    mnemonic: string,
    name: string,
    password: string,
    tags: Tags,
    tagOptions: TagOptions
  },
  setters: {
    setMnemonic: React.Dispatch<React.SetStateAction<string>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
    handleAddTag: (event: React.SyntheticEvent, data: any) => void // FIXME any
    handleOnChange: (event: React.SyntheticEvent, data: any) => void // FIXME any
  },
  goToNextStep: () => void
) {
  const { mnemonic, name, password, tagOptions, tags } = values;
  const { handleAddTag, handleOnChange, setMnemonic, setName, setPassword } = setters;

  const renderSetTags = () => {

    return (
      <Stacked>
        <SubHeader noMargin>Add Tags:</SubHeader>
        <Dropdown
          allowAdditions
          fluid
          multiple
          onAddItem={handleAddTag}
          onChange={handleOnChange}
          options={tagOptions}
          search
          selection
          value={tags} />
      </Stacked>
    );
  };

  return (
    <Stacked>
      <SubHeader> Create from the following mnemonic phrase </SubHeader>
      <Stacked>
        <MnemonicSegment onClick={() => setMnemonic(mnemonicGenerate())} mnemonic={mnemonic} />
        <WrapperDiv margin='0'>
          {renderSetName(name, setName)}
          <Margin top='small' />
          {renderSetPassword(password, setPassword)}
          <Margin top='small' />
          {renderSetTags()}
        </WrapperDiv>
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
    setRewritePhrase: React.Dispatch<React.SetStateAction<string>>
  },
  createNewAccount: () => void,
  goToPreviousStep: () => void
) {
  const { rewritePhrase } = values;
  const { setRewritePhrase } = setters;

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
          <NavButton onClick={createNewAccount}> Save </NavButton>
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
