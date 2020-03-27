// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { InputAddress } from '../src/InputAddress';
import { withTheme } from './customDecorators';

const SAMPLE_ACCOUNT_1 = 'ExuzF7kjvyUsk6TMH4MhKA4AE7DY6NCts4SDj9Q3HS1dP5W';
const SAMPLE_ACCOUNT_2 = 'HqFz5RBczgtKrHQGav7DFZwSwrDXxKjLWc95mMDidVdfpwC';

const KEYRING_ACCOUNTS = {
  [SAMPLE_ACCOUNT_1]: {
    json: { address: SAMPLE_ACCOUNT_1, meta: { name: 'Foo' } },
    option: { key: 'foo', name: 'foo', value: 'baz' },
  },
  [SAMPLE_ACCOUNT_2]: {
    json: { address: SAMPLE_ACCOUNT_2, meta: { name: 'Bar' } },
    option: { key: 'bar', name: 'bar', value: 'baz' },
  },
};

const EXTENSION_ACCOUNTS = [
  {
    address: SAMPLE_ACCOUNT_1,
    meta: {
      genesisHash:
        '0xac71396b27f84ab0634df7633bc42cc681005c77502a810cb0aa5c19297491dc',
      name: 'Foo',
      source: 'polkadot-js',
    },
  },
  {
    address: SAMPLE_ACCOUNT_2,
    meta: {
      genesisHash:
        '0xac71396b27f84ab0634df7633bc42cc681005c77502a810cb0aa5c19297491dc',
      name: 'Bar',
      source: 'polkadot-js',
    },
  },
];

export const InputAddressStory = (): React.ReactElement => {
  return (
    <>
      <InputAddress
        textLabel='From'
        accounts={EXTENSION_ACCOUNTS}
        fromKeyring={false}
        value={SAMPLE_ACCOUNT_1}
      />
      <InputAddress
        textLabel='To'
        accounts={EXTENSION_ACCOUNTS}
        fromKeyring={false}
        value={SAMPLE_ACCOUNT_1}
      />
    </>
  );
};

storiesOf('Input/InputAddress', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('InputAddress | Keyring', () => (
    <InputAddress
      accounts={KEYRING_ACCOUNTS}
      onChangeAddress={action('onChange clicked')}
      textLabel={text('textLabel', 'Choose Account')}
      value={text('address', SAMPLE_ACCOUNT_1)}
      wrapClass={text('wrapClass', 'Choose Account')}
    />
  ))
  .add('InputAddress | Extension', () => <InputAddressStory />);
