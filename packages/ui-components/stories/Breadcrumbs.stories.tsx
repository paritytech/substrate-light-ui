// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Breadcrumbs, WrapperDiv } from '../src';
import { withTheme } from './customDecorators';

const sectionLabels = [
  'Welcome',
  'Stash',
  'Controller',
  'Confirm',
  'Claim',
  'Bond',
];

storiesOf('Breadcrumbs', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('3 sections', () => (
    <WrapperDiv width='100%'>
      <Breadcrumbs
        activeLabel={select('activeLabel', sectionLabels, 'Welcome')}
        onClick={action('clicked')}
        sectionLabels={sectionLabels}
      />
    </WrapperDiv>
  ));
