// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { withKnobs, text, select, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Accordion } from '../src';

storiesOf('Accordion', module)
  .addDecorator(withKnobs)
  .add('inactive with no children or title', () => (
    <Accordion />
  ))
  .add('inactive with content and title', () => (
    <Accordion fluid inverted styled>
      <Accordion.Title active={boolean('active', false)}>
        <Icon name='dropdown' /> Title Goes Here
      </Accordion.Title>
      <Accordion.Content active={boolean('active', false)}>
        Hello this is my content
      </Accordion.Content>
    </Accordion>
  ));
