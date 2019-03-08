// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import Address from '../src/Address';

storiesOf('Address Segment', module)
  .addDecorator(withKnobs)
  .add('with address', () => (
    <Address address={text('address', '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwKBVk')} />
  ));
