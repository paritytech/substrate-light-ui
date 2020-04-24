// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Paragraph } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Paragraph', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Paragraph', () => {
    const children = text('children', 'Paragraph children node');
    const className = text('className', '');
    const status = select('status', ['success', 'error', 'none'], 'none');
    const faded = boolean('faded', false);

    return (
      <Paragraph className={className} faded={faded} status={status}>
        {children}
      </Paragraph>
    );
  });
