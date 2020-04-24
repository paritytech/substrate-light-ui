// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Accordion, Header, Icon, Layout } from '../src';
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
        <Layout>
          <Icon name='dropdown' onClick={linkTo('Accordion', 'active')} />
          <Header as='h4'> Click Icon </Header>
        </Layout>
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
        <Layout>
          <Icon name='dropdown' onClick={linkTo('Accordion', 'inactive')} />
          <Header as='h4'> Click Icon </Header>
        </Layout>
      </Accordion.Title>
      <Accordion.Content active={boolean('active', true)}>
        Hello this is my content
      </Accordion.Content>
    </Accordion>
  ));
