// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { AddressSummary, Grid, MarginTop, NavLink, Stacked, SubHeader, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

type State = {
  allAccounts: Array<KeyringPair>,
  allAddresses: Array<KeyringAddress>
};

export class Saved extends React.PureComponent<Props, State> {
  state: State = {
    allAccounts: [],
    allAddresses: []
  };

  componentWillMount () {
    // FIXME: Only load keyring once after light-api is set
    try {
      keyring.loadAll();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount () {
    this.setState({
      allAccounts: keyring.getPairs(),
      allAddresses: keyring.getAddresses()
    });
  }

  render () {
    return (
      <WalletCard
        header='Saved Identities'
        overflow='scroll'
        subheader='Quickly select an identity that you have previously saved to transfer balance to'>
        <MarginTop marginTop='3.5rem' />
        <Grid>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> My Unlocked Accounts </SubHeader>
              <WithSpace>
                  { this.renderAccounts() }
              </WithSpace>
            </Stacked>
          </Grid.Column>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> Saved Addresses </SubHeader>
              <WithSpace>
                  { this.renderAddresses() }
              </WithSpace>
            </Stacked>
          </Grid.Column>
        </Grid>
      </WalletCard>
    );
  }

  renderAccounts () {
    const { allAccounts } = this.state;

    if (!allAccounts.length) {
      this.renderEmpty();
    }

    return allAccounts.map((pair: KeyringPair) => {
      return (
        <React.Fragment key={`__unlocked_${pair.address()}`}>
          <MarginTop />
          <Link to={`/identity/${pair.address()}`}>
            <AddressSummary
              address={pair.address()}
              name={pair.getMeta().name}
              orientation='horizontal'
              size='small' />
          </Link>
        </React.Fragment>
      );
    });
  }

  renderAddresses () {
    const { allAddresses } = this.state;

    if (!allAddresses.length) {
      this.renderEmpty();
    }

    return allAddresses.map((address: KeyringAddress) => {
      return (
        <React.Fragment key={`__locked_${address}`}>
          <MarginTop />
          <Link to={`/identity/${address}`}>
            <AddressSummary
              address={address}
              orientation='horizontal'
              size='small' />
          </Link>
        </React.Fragment>
      );
    });
  }

  renderEmpty () {
    const { match } = this.props;
    const address = match.params.currentAddress;

    return (
      <React.Fragment>
        <p> It looks like you don't have any saved accounts. <br /> You can add them from your address book in Identity app. </p>
        <NavLink to={`/identity/${address}`}> Take me there </NavLink>
      </React.Fragment>
    );
  }
}
