// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Progress } from '../src/Progress';
import { WrapperDiv } from '../src/Shared.styles';
import { withTheme } from './customDecorators';

storiesOf('Progress Bar', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Primary', () => (
    <WrapperDiv>
      <Progress
        disabled={boolean('disable', false)}
        percent={number('percent complete', 50)}
      />
    </WrapperDiv>
  ));
