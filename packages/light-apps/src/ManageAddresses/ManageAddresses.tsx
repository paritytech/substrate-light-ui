// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Container } from '@substrate/ui-components';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Add } from './Add';
import { Edit } from './Edit';
import { SavedAddresses } from '../SavedAddresses';
import { Grid } from 'semantic-ui-react';

interface Props extends RouteComponentProps<{}> { }

export class ManageAddresses extends React.PureComponent<Props> {
  render () {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={9}>
              <Switch>
                <Route path='/addresses/:address' component={Edit} />
                <Route component={Add} />
              </Switch>
            </Grid.Column>
            <Grid.Column width={7}>
              <SavedAddresses />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
