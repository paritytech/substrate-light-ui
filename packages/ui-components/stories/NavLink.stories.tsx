import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import NavLink from '../src/NavLink';

storiesOf('NavLink', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MemoryRouter intitialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('no children', () => (
    <NavLink to={text('to', '/there')} />
  ))
  .add('with child string', () => (
    <NavLink to={text('to', '/there')}> {text('child', 'Link Value')} </NavLink>
  ))
  .add('with value prop', () => (
    <NavLink to={text('to', '/there')} value={text('Terms & Conditions')}> {text('child', 'Link Value')} </NavLink>
  ));
