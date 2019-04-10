// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { withMemoryRouter, withTheme } from './customDecorators';
import { FONT_SIZES } from '../src/constants';
import { NavLink } from '../src/NavLink';
import { FontSize } from '../src/types';

storiesOf('NavLink', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withMemoryRouter)
  .add('no children', () => (
    <NavLink onClick={action('clicked')} to={text('to', '/there')} />
  ))
  .add('with child string', () => (
    <NavLink onClick={action('clicked')} to={text('to', '/there')}> {text('child', 'Link')} </NavLink>
  ))
  .add('with value prop', () => (
    <NavLink onClick={action('clicked')} to={text('to', '/there')} value={text('Value', 'Terms and Conditions')}> this should be ignored </NavLink>
  ))
  .add('with font props', () => (
    <NavLink
      onClick={action('clicked')}
      fontSize={select('font size', FONT_SIZES, 'medium') as FontSize}
      fontWeight={text('font weight', '500')}
      to={text('to', '/there')}>
      {text('child', 'Link')}
    </NavLink>
  ));
