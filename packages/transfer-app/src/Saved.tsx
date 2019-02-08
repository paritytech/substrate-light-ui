// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, Grid, MarginTop, NavLink, Stacked, StyledLinkButton, SubHeader, WalletCard, WithSpace } from '@substrate/ui-components';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
  onSelectAddress: (address: string) => void;
}

type State = {
  allAccounts: Array<KeyringPair>,
  allAddresses: Array<KeyringAddress>
};

export class Saved extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    allAccounts: [],
    allAddresses: []
  };

  componentDidMount () {
    const { keyring } = this.context;

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
                {this.renderAccountsToSendFrom()}
              </WithSpace>
            </Stacked>
          </Grid.Column>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> Saved Addresses </SubHeader>
              <WithSpace>
                {this.renderAddressesToSendTo()}
              </WithSpace>
            </Stacked>
          </Grid.Column>
        </Grid>
      </WalletCard>
    );
  }

  renderAccountsToSendFrom () {
    const { allAccounts } = this.state;

    if (!allAccounts.length) {
      this.renderEmpty();
    }

    return allAccounts.map((pair: KeyringPair) => {
      return (
        <React.Fragment key={`__unlocked_${pair.address()}`}>
          <MarginTop />
          <Link to={`/transfer/${pair.address()}`}>
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

  handleSelectedRecipient = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { onSelectAddress } = this.props;

    const address = event.currentTarget.dataset.id;

    onSelectAddress(address!);
  }

  renderAddressesToSendTo () {
    const { allAddresses } = this.state;

    if (!allAddresses.length) {
      this.renderEmpty();
    }

    return allAddresses.map((address: KeyringAddress) => {
      return (
        <React.Fragment key={`__locked_${address.address()}`}>
          <MarginTop />
          <StyledLinkButton data-id={address.address()} onClick={this.handleSelectedRecipient}>
            <AddressSummary
              address={address.address()}
              name={address.getMeta().name}
              orientation='horizontal'
              size='small' />
          </StyledLinkButton>
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
