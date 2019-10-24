// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { Progress } from '../src/Progress';
import { WrapperDiv } from '../src/Shared.styles';

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
