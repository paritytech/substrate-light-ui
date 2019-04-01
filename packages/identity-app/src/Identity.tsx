// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@substrate/ui-components';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import { ManageAccounts } from './ManageAccounts';

interface Props extends RouteComponentProps {}

const accountManagementOptions = [
  {
    key: 'Edit',
    text: 'Edit',
    value: 'Edit'
  },
  {
    key: 'Create',
    text: 'Create',
    value: 'Create'
  },
  {
    key: 'Restore',
    text: 'Restore',
    value: 'Restore'
  }
];

const addressManagementOptions = [
  {
    key: 'Lookup',
    text: 'Lookup',
    value: 'Lookup'
  },
  {
    key: 'Add',
    text: 'Add',
    value: 'Add'
  }
];

export class Identity extends React.PureComponent<Props> {
  render () {
    return (
      <Container>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <Menu>
                <Dropdown
                    placeholder='Manage Accounts'
                    fluid
                    selection
                    options={accountManagementOptions}
                  />
                <Dropdown
                    placeholder='Manage Addresses'
                    fluid
                    selection
                    options={addressManagementOptions}
                  />
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
