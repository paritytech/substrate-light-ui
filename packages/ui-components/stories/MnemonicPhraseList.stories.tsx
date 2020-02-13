// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { MnemonicPhraseList } from '../src';
import { withTheme } from './customDecorators';

const SAMPLE_PHRASE =
  'glass decrease speak taxi pencil spice carpet danger planet will cage park';

storiesOf('Mnemonic Phrase List', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with mnemonic', () => (
    <MnemonicPhraseList phrase={text('mnemonic phrase', SAMPLE_PHRASE)} />
  ));
