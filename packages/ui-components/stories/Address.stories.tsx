import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import Address from '../src/Address/';

storiesOf('Address Segment', module)
  .addDecorator(withKnobs)
  .add('with Placeholder Address', () => (
    <Address />
  ))
  .add('with address', () => (
    <Address address={text('address', '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwKBVk')} />
  ));
