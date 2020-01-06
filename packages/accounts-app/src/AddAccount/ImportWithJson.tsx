// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { AlertsContext, handler } from '@substrate/context';
import {
  Dropdown,
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

import { KeyringContext } from '../KeyringContext';
import { TagOptions, Tags } from './types';

type Step = 'upload' | 'password';

export function ImportWithJson(): React.ReactElement {
  const { enqueue } = useContext(AlertsContext);
  const { keyring } = useContext(KeyringContext);

  const [errorText, setErrorText] = useState();
  const [step, setStep] = useState('upload' as Step);
  const [inputPassword, setInputPassword] = useState('');
  const [jsonString, setJsonString] = useState('');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' },
  ]);

  const [tags, setTags] = useState<Tags>([]);

  const checkAndAddTags = (json: KeyringJson): void => {
    if (json.meta.tags) {
      json.meta.tags.forEach((tag: string): void => {
        setTagOptions([...tagOptions, { key: tag, text: tag, value: tag }]);
      });

      setTags(json.meta.tags as Tags);
    }
  };

  const handleAddTag = (_event: React.SyntheticEvent, { value }: any): void => {
    setTagOptions([...tagOptions, { key: value, text: value, value }]);
  };

  const handleOnChange = (_event: React.SyntheticEvent, { value }: any): void => {
    setTags(value);
  };

  const handleFileUploaded = (file: string | null): void => {
    try {
      if (!file) {
        throw new Error('File was empty. Make sure you uploaded the correct file and try again.');
      }

      checkAndAddTags(JSON.parse(file));

      setJsonString(file);
      setStep('password');
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error',
      });
    }
  };

  const handleRestoreWithJson = (): void => {
    try {
      const json = JSON.parse(jsonString);

      const isAlreadyInKeyring =
        keyring.getAccounts().filter((account: KeyringAddress) => account.address === json.address).length > 0;

      if (isAlreadyInKeyring) {
        setErrorText('You have already unlocked this account in your keyring!');
        return;
      }

      if (tags) {
        json.meta.tags = json.meta.tags.concat(tags);
      }

      keyring.restoreAccount(json, inputPassword);
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error',
      });
    }
  };

  const renderSetTags = (): React.ReactElement => {
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
          value={tags}
        />
      </Stacked>
    );
  };

  return (
    <Stacked>
      <SubHeader> Restore Account from JSON Backup File </SubHeader>
      {step === 'upload' ? (
        <InputFile onChange={handleFileUploaded} />
      ) : (
        <>
          <WrapperDiv>
            <Input fluid label='Password' onChange={handler(setInputPassword)} type='password' />
            <Margin top />
            {renderSetTags()}
          </WrapperDiv>
          <Margin top />
          <ErrorText>{errorText}</ErrorText>
          <NavButton onClick={handleRestoreWithJson} value='Restore' />
        </>
      )}
    </Stacked>
  );
}
