// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@polkadot/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SendBalance } from './SendBalance';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

export class Transfer extends React.PureComponent<Props> {
  render () {
    return (
      <Container>
        <Grid>
          <Grid.Row centered>
            <SendBalance {...this.props} />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
