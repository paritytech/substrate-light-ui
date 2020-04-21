// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Card, Header, Paragraph, substrateLightTheme } from '../src';

const colorPaletteCard = (color: string, hex: string): React.ReactElement => (
  <Card
    style={{
      flex: '1 0 calc(33.333% - 20px)',
      maxWidth: 'calc(33.333% - 20px)',
    }}
  >
    <div style={{ background: hex, width: '100%', height: '85%' }} />
    <Card.Content style={{ display: 'flex column', textAlign: 'center' }}>
      <Card.Header> {color} </Card.Header>
      <Card.Description>
        <b>Hex:</b>
        {hex}
      </Card.Description>
    </Card.Content>
  </Card>
);

storiesOf('Theme', module)
  .addDecorator(withKnobs)
  .add('colors', () => (
    <>
      {Object.entries(substrateLightTheme).map(([color, hex]) => {
        return colorPaletteCard(color, hex);
      })}
    </>
  ))
  .add('typescale', () => (
    <>
      <Header as='h1'> h1 </Header>
      <Header> h2 (default) </Header>
      <Header as='h3'> h3 </Header>
      <Header as='h4'> h4 </Header>
      <Header as='h5'> h5 </Header>
      <Header as='h6'> h6 </Header>

      <Paragraph className={text('className', '')} status='success'>
        Success
      </Paragraph>
      <Paragraph className={text('className', '')} status='error'>
        Error
      </Paragraph>
      <Paragraph className={text('className', '')} faded>
        Faded
      </Paragraph>
    </>
  ))
  .add('typography', () => (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: 'Segoe UI' }}> Segoe UI </h2>
        <h2 style={{ fontFamily: 'Roboto' }}> Roboto </h2>
        <h2 style={{ fontFamily: 'Oxygen' }}> Oxygen </h2>
        <h2 style={{ fontFamily: 'Ubuntu' }}> Ubuntu </h2>
        <h2 style={{ fontFamily: 'Cantarell' }}> Cantarell </h2>
        <h2 style={{ fontFamily: 'Fira Sans' }}> Fira Sans </h2>
        <h2 style={{ fontFamily: 'Droid Sans' }}> Droid Sans </h2>
        <h2 style={{ fontFamily: 'Helvetica Neue' }}> Helvetica Neue </h2>
      </div>
      <div style={{ flex: 1 }}>
        <h5 style={{ fontFamily: 'Segoe UI' }}> Segoe UI </h5>
        <h5 style={{ fontFamily: 'Roboto' }}> Roboto </h5>
        <h5 style={{ fontFamily: 'Oxygen' }}> Oxygen </h5>
        <h5 style={{ fontFamily: 'Ubuntu' }}> Ubuntu </h5>
        <h5 style={{ fontFamily: 'Cantarell' }}> Cantarell </h5>
        <h5 style={{ fontFamily: 'Fira Sans' }}> Fira Sans </h5>
        <h5 style={{ fontFamily: 'Droid Sans' }}> Droid Sans </h5>
        <h5 style={{ fontFamily: 'Helvetica Neue' }}> Helvetica Neue </h5>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'Segoe UI' }}> Segoe UI </p>
        <p style={{ fontFamily: 'Roboto' }}> Roboto </p>
        <p style={{ fontFamily: 'Oxygen' }}> Oxygen </p>
        <p style={{ fontFamily: 'Ubuntu' }}> Ubuntu </p>
        <p style={{ fontFamily: 'Cantarell' }}> Cantarell </p>
        <p style={{ fontFamily: 'Fira Sans' }}> Fira Sans </p>
        <p style={{ fontFamily: 'Droid Sans' }}> Droid Sans </p>
        <p style={{ fontFamily: 'Helvetica Neue' }}> Helvetica Neue </p>
      </div>
    </div>
  ));
