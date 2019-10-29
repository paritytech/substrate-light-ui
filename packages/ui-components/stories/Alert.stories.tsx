// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { Alert } from '../src/Alert';

storiesOf('Alerts', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Error', () => (
    <Alert
      error={true}
      info={false}
      success={false}
      warning={false}
    >
      This is an error!
    </Alert>
  ))
  .add('Info', () => (
    <Alert
      error={false}
      info={true}
      success={false}
      warning={false}
    >
      For your information: this is an information
    </Alert>
  ))
  .add('Success', () => (
    <Alert
      error={false}
      info={false}
      success={true}
      warning={false}
    >
      Such success!
    </Alert>
  ))
  .add('Warning', () => (
    <Alert
      error={true}
      info={false}
      success={false}
      warning={true}
    >
      I&apos;m warning you, don&apos;t do it.
    </Alert>
  ));
