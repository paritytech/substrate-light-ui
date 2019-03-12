// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';

import { substrateLightTheme } from '../src/globalStyle';
import { Card, Container, Grid } from '../src';

const colorPaletteCard = (color, hex) => (
  <Card>
    <div style={{ background: hex, width: '100%', height: '85%' }} />
    <Card.Content style={{ display: 'flex column', textAlign: 'center' }}>
      <Card.Header> <b>Color:</b> {color} </Card.Header>
      <Card.Description> <b>Hex:</b> {hex} </Card.Description>
    </Card.Content>
  </Card>
);

storiesOf('Theme', module)
  .add('colors', () => (
    <Container>
      <Grid>
        <Grid.Row style={{ display: 'flex', alignItems: 'space-between' }}>
          {
            Object.entries(substrateLightTheme).map(([color, hex]) => {
              return colorPaletteCard(color, hex);
            })
          }
        </Grid.Row>
      </Grid>
    </Container>
  ));
