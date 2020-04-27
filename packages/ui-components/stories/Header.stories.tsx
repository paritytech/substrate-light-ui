// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Header, NavHeader, Paragraph } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Header', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Header', () => {
    const as = select('as', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'h2');
    const children = text('children', 'Header children node');
    const className = text('className', '');
    const wrapClass = text('wrapClass', '');
    return (
      <>
        <Header as={as} wrapClass={wrapClass} className={className}>
          {children}
        </Header>
        <Paragraph>Paragraph after Header</Paragraph>
      </>
    );
  })
  .add('empty', () => <NavHeader />)
  .add('with header', () => <NavHeader siteTitle={text('title', 'Nomidot')} />);
