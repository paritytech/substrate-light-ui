// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Accordion, Icon, StackedHorizontal, SubHeader } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Accordion', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('no props', () => <Accordion />)
  .add('inactive', () => (
    <Accordion
      fluid={boolean('fluid', false)}
      inverted={boolean('inverted', false)}
      styled={boolean('styled', false)}
    >
      <Accordion.Title active={boolean('active', false)}>
        <StackedHorizontal>
          <Icon name='dropdown' onClick={linkTo('Accordion', 'active')} />
          <SubHeader noMargin> Click Icon </SubHeader>
        </StackedHorizontal>
      </Accordion.Title>
      <Accordion.Content active={boolean('active', false)}>
        Hello this is my content
      </Accordion.Content>
    </Accordion>
  ))
  .add('active', () => (
    <Accordion
      fluid={boolean('fluid', false)}
      inverted={boolean('inverted', false)}
      styled={boolean('styled', false)}
    >
      <Accordion.Title active={boolean('active', true)}>
        <StackedHorizontal>
          <Icon name='dropdown' onClick={linkTo('Accordion', 'inactive')} />
          <SubHeader noMargin> Click Icon </SubHeader>
        </StackedHorizontal>
      </Accordion.Title>
      <Accordion.Content active={boolean('active', true)}>
        Hello this is my content
      </Accordion.Content>
    </Accordion>
  ));
