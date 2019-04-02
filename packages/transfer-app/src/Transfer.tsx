// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import addresses$ from '@polkadot/ui-keyring/observable/addresses';
import accounts$ from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Subscribe } from '@substrate/ui-api';
import { Container, Grid, Header, InputAddress } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface MatchParams {
  currentAccount: string;
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
            <Header>Transfer Balance</Header>
          </Grid.Row>

          <Grid.Row>
            <Subscribe>
              {combineLatest(accounts$.subject, addresses$.subject)
                .pipe(
                  map(([accounts, addresses]) => this.renderDropdown(accounts, addresses))
                )
              }
            </Subscribe>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  renderDropdown = (accounts: SubjectInfo, addresses: SubjectInfo) => {
    return <InputAddress
      accounts={accounts}
      addresses={addresses}
      defaultValue={this.props.match.params.currentAccount}
      fluid
      placeholder='Send from...'
      selection
    />;
  }
}
