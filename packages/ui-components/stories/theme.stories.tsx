// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { Card, Container, DynamicSizeText, ErrorText, FadedText, FONT_SIZES, FontSize, Header, SubHeader, SuccessText, substrateLightTheme } from '../src';

const colorPaletteCard = (color: string, hex: string): React.ReactElement => (
  <Card style={{ flex: '1 0 calc(33.333% - 20px)', maxWidth: 'calc(33.333% - 20px)' }}>
    <div style={{ background: hex, width: '100%', height: '85%' }} />
    <Card.Content style={{ display: 'flex column', textAlign: 'center' }}>
      <Card.Header> {color} </Card.Header>
      <Card.Description> <b>Hex:</b> {hex} </Card.Description>
    </Card.Content>
  </Card>
);

storiesOf('Theme', module)
  .addDecorator(withKnobs)
  .add('colors', () => (
    <Container style={{ display: 'flex', flexFlow: 'row wrap', width: '90%' }}>
      {
        Object.entries(substrateLightTheme).map(([color, hex]) => {
          return colorPaletteCard(color, hex);
        })
      }
    </Container>
  ))
  .add('typescale', () => (
    <Container>
      <Header> Header </Header>
      <SubHeader> SubHeader </SubHeader>
      <SuccessText> Success </SuccessText>
      <ErrorText> Error </ErrorText>
      <FadedText> Faded </FadedText>
      <DynamicSizeText
        fontSize={select('font size', FONT_SIZES, 'medium') as FontSize}
        fontWeight={text('fontWeight', '500')}>
        Dynamic
      </DynamicSizeText>
    </Container>
  ))
  .add('typography', () => (
    <Container>
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
    </Container>
  ));
