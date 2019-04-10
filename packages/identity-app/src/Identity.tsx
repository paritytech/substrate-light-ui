// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Grid } from '@substrate/ui-components';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SavedAccounts } from './SavedAccounts';
import { ManageAccounts } from './ManageAccounts';

export class Identity extends React.PureComponent {
  render () {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Switch>
              <Route path='/identity/:currentAccount' component={ManageAccounts} />
            </Switch>
          </Grid.Column>
          <Grid.Column width={7}>
            <Switch>
              <Route path='/identity/:currentAccount' component={SavedAccounts} />
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
