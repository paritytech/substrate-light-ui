// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Alert, Layout } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Alerts', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Alert', () => {
    const AlertProps = {
      alertType: select(
        'alertType',
        ['error', 'success', 'info', 'warning'],
        'info'
      ),
      className: text('className', ''),
    };
    return (
      <Layout alert>
        <Alert {...AlertProps}>Your alert here</Alert>
        <Alert>For your information: this is an information</Alert>
        <Alert alertType='error'>This is an error!</Alert>
        <Alert alertType='success'>
          Congratulations! This is a success message
        </Alert>
        <Alert alertType='warning'>
          I&apos;m warning you, don&apos;t do it.
        </Alert>
      </Layout>
    );
  });
