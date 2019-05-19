// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { WrapperDiv } from '../src/Shared.styles';
import { YayNay } from '../src/YayNay';

storiesOf('Yay or Nay', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Example', () => (
    <WrapperDiv>
      <YayNay yay={number('yay', 12)} nay={number('nay', 23)} />
    </WrapperDiv>
  ));
