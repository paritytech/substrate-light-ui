// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@substrate/ui-components';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';

import { ManageAccounts } from './ManageAccounts';

interface Props extends RouteComponentProps {}

export class Identity extends React.PureComponent<Props> {
  render () {
    const panes = [
      { menuItem: 'Manage Accounts', render: () => <ManageAccounts {...this.props} /> }
    ];

    return (
      <Container>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={10}>
              <Tab panes={panes} menu={{ borderless: true }} />
            </Grid.Column>
            <Grid.Column width={6}>
              nothing else
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
