// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import { withTheme } from './customDecorators/withTheme';
import NavLink from '../src/NavLink';

storiesOf('NavLink', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('no children', () => (
    <NavLink to={text('to', '/there')} />
  ))
  .add('with child string', () => (
    <NavLink to={text('to', '/there')}> {text('child', 'Link Value')} </NavLink>
  ))
  .add('with value prop', () => (
    <NavLink to={text('to', '/there')} value={text('Value', 'Terms & Conditions')}> {text('Child', 'Link Value')} </NavLink>
  ));
