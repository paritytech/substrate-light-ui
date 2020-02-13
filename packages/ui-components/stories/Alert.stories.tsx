// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Alert } from '../src/Alert';
import { withTheme } from './customDecorators';

storiesOf('Alerts', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Error', () => (
    <Alert error={true} info={false} success={false} warning={false}>
      This is an error!
    </Alert>
  ))
  .add('Info', () => (
    <Alert error={false} info={true} success={false} warning={false}>
      For your information: this is an information
    </Alert>
  ))
  .add('Success', () => (
    <Alert error={false} info={false} success={true} warning={false}>
      Such success!
    </Alert>
  ))
  .add('Warning', () => (
    <Alert error={true} info={false} success={false} warning={true}>
      I&apos;m warning you, don&apos;t do it.
    </Alert>
  ));
