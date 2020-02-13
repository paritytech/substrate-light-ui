// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { WrapperDiv } from '../src/Shared.styles';
import { YayNay } from '../src/YayNay';
import { withTheme } from './customDecorators';

storiesOf('Yay or Nay', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Example', () => (
    <WrapperDiv>
      <YayNay yay={number('yay', 12)} nay={number('nay', 23)} />
    </WrapperDiv>
  ));
