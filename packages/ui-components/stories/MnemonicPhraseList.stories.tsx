// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { MnemonicPhraseList } from '../src';

const SAMPLE_PHRASE = 'glass decrease speak taxi pencil spice carpet danger planet will cage park';

storiesOf('Mnemonic Phrase List', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with mnemonic', () => (
    <MnemonicPhraseList phrase={text('mnemonic phrase', SAMPLE_PHRASE)} />
  ));
