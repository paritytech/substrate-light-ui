// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { withKnobs, text, select, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Accordion, Icon } from '../src';

storiesOf('Accordion', module)
  .addDecorator(withKnobs)
  .add('inactive with no children or title', () => (
    <Accordion />
  ))
  .add('inactive with title', () => (
    <Accordion>
      <Accordion.Title> Awesome Title </Accordion.Title>
    </Accordion>
  ))
  .add('inactive with content and title', () => (
    <Accordion styled>
      <Accordion.Title active={false}>
        <Icon name='dropdown' />
      </Accordion.Title>
      <Accordion.Content>
        Hello this is my content
      </Accordion.Content>
    </Accordion>
  ))
  .add('active with child', () => (
    <Accordion active> hello </Accordion>
  ));
