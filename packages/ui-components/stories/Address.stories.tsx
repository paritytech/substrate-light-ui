import React from 'react';
import { storiesOf } from '@storybook/react';
import Address from '../src/Address/';

storiesOf('Address Segment', module)
  .add('with Placeholder Address', () => (
    <Address />
  ))
  .add('with address', () => (
    <Address address={'5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwKBVk'} />
  ));
