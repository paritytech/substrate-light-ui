// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import { withMemoryRouter, withTheme } from './customDecorators';
import NavLink from '../src/NavLink';

storiesOf('NavLink', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withMemoryRouter)
  .add('no children', () => (
    <NavLink to={text('to', '/there')} />
  ))
  .add('with child string', () => (
    <NavLink to={text('to', '/there')}> {text('child', 'Link')} </NavLink>
  ))
  .add('with value prop', () => (
    <NavLink to={text('to', '/there')} value={text('Value', 'Terms and Conditions')}> this should be ignored </NavLink>
  ))
  .add('with font props', () => (
    <NavLink
      fontSize={text('font size', '17px')}
      fontWeight={text('font weight', '500')}
      to={text('to', '/there')}>
        {text('child', 'Link')}
    </NavLink>
  ));
