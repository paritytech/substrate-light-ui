// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { stringUpperFirst } from '@polkadot/util';
import { ApiContext, Subscribe } from '@substrate/ui-api';
import { Address, AddressSummary, Card, Dropdown, StackedHorizontal, WithSpaceAround } from '@substrate/ui-components';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

interface Props extends RouteComponentProps { }

type State = {};

// TODO: Add Governance Once That's in
const APP_OPTIONS = [
  {
    key: 'Identity',
    text: 'Identity',
    value: 'Identity'
  },
  {
    key: 'Transfer',
    text: 'Transfer',
    value: 'Transfer'
  }];

export class IdentityHeader extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {};

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
  }

  getButtonText = () => {
    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    const to = currentLocation === 'identity' ? 'transfer' : 'identity';
    return stringUpperFirst(to);
  }

  getName = () => {
    const { keyring } = this.context;
    const address = this.getAddress();

    return address && keyring.getAccount(address).getMeta().name;
  }

  handleToggleApp = () => {
    const { location, history } = this.props;
    const address = this.getAddress();
    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    const to = currentLocation === 'identity' ? 'transfer' : 'identity';

    history.push(`/${to}/${address}`);
  }

  render () {
    const { api } = this.context;

    const address = this.getAddress();
    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    return (
      <Card>
        <StackedHorizontal>
        <WithSpaceAround>
          <Address address={address} />
          <Dropdown
            floating
            onChange={this.handleToggleApp}
            options={APP_OPTIONS}
            selection
            value={currentLocation} />
            {address
              ?
              <React.Fragment>
                <Subscribe>
                  {
                    // FIXME using any because freeBalance gives a Codec here, not a Balance
                    // Wait for @polkadot/api to have TS support for all query.*
                    api.query.balances.freeBalance(address).pipe(map(this.renderSummary as any))
                  }
                </Subscribe>
              </React.Fragment>
              : <div>Loading...</div>
            }
        </WithSpaceAround>
      </StackedHorizontal>
     </Card>
    );
  }

  renderSummary = (balance: Balance) => {
    const address = this.getAddress();
    const name = this.getName();

    return <AddressSummary address={address} balance={balance} name={name} />;
  }
}
