// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Grid, Icon, Input, MarginTop, Modal, NavButton, Stacked, StackedHorizontal, StyledLinkButton, WalletCard } from '@polkadot/ui-components';

import BN from 'bn.js';
import React from 'react';
import { Step } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';

import { Saved } from './Saved';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

type State = {
  amount: BN,
  isAddressValid: boolean,
  open: boolean,
  recipientAddress?: string,
  step: number
};

export class SendBalance extends React.PureComponent<Props, State> {
  state: State = {
    amount: new BN(0),
    isAddressValid: false,
    open: false,
    step: 1
  };

  onChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amount: new BN(value)
    });
  }

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isAddressValid: value[0] === '5' && value.length === 48, // FIXME: do a more thorough check
      recipientAddress: value
    });
  }

  onClose = () => {
    this.setState({
      open: false
    });
  }

  onSubmitTransfer = () => {
    // FIXME: handle transfer
  }

  openSelectAccountsModal = () => {
    this.setState({
      open: true
    });
  }

  selectExternalAccountTrigger = <StyledLinkButton onClick={this.openSelectAccountsModal}> Select From Saved Identities </StyledLinkButton>;

  render () {
    const { amount, isAddressValid, recipientAddress } = this.state;

    return (
      <WalletCard
        header='Transfer balance'>
        <Grid>
          <Grid.Row centered>
            <MarginTop marginTop='2rem' />
            { this.renderSelectAccountModal() }
            <MarginTop marginTop='2rem' />
            <StackedHorizontal>
              <Step.Group>
                <Step completed={isAddressValid}>
                  <Step.Title> Recipient </Step.Title>
                  <Icon name='address book' color='blue' />
                  <Step.Content>
                    <MarginTop />
                    <Stacked>
                      <AddressSummary address={recipientAddress} size='small' />
                      <Input onChange={this.onChangeRecipientAddress} type='text' value={recipientAddress} />
                    </Stacked>
                  </Step.Content>
                </Step>

                <Step completed={!amount.isZero()}>
                  <Step.Title> Amount </Step.Title>
                  <Icon name='law' color='blue' />
                  <Step.Content>
                    <Stacked>
                      <Input onChange={this.onChangeAmount} type='number' value={amount} />
                    </Stacked>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='send' color='blue' />
                  <Step.Content>
                    <NavButton onClick={this.onSubmitTransfer}>Submit Transfer</NavButton>
                  </Step.Content>
                </Step>
              </Step.Group>
            </StackedHorizontal>
          </Grid.Row>
        </Grid>
      </WalletCard>
    );
  }

  renderSelectAccountModal () {
    const { open } = this.state;

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={true}
        dimmer='blurring'
        open={open}
        onClose={this.onClose}
        trigger={this.selectExternalAccountTrigger}>
          <Saved {...this.props} />
      </Modal>
    );
  }
}
