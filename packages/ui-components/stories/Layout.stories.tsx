// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Layout } from '../src/Layout';
import { withTheme } from './customDecorators';

storiesOf('Layout', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Layout', () => {
    const className = text('className', '');
    const framed = boolean('framed', false);

    return (
      <Layout framed={framed} className={className}>
        <div className='bg-red h3 w3' />
        <div className='bg-black h4 w4' />
      </Layout>
    );
  });
