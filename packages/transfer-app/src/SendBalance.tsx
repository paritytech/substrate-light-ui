// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import ApiRx from '@polkadot/api/rx';
import { Nonce } from '@polkadot/api/types';
import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, Grid, Header, Icon, Input, MarginTop, NavButton, Stacked } from '@substrate/ui-components';
import BN from 'bn.js';
import React from 'react';
import { Step } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import { first, map, switchMap } from 'rxjs/operators';

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
  recipientName?: string,
  step: number
};

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

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

  onSelectAddress = (address: string, name: string) => {
    this.setState({
      isAddressValid: this.isValidAddress(address),
      recipientName: name,
      recipientAddress: address
    });
  }

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isAddressValid: this.isValidAddress(value),
      recipientAddress: value
    });
  }

  onClose = () => {
    this.setState({
      open: false
    });
  }

  onSubmitTransfer = async () => {
    const { keyring } = this.context;
    const { amount, recipientAddress } = this.state;
    const { match } = this.props;

    const api = await ApiRx.create().toPromise();

    const senderAddress = match.params.currentAddress;
    const senderPair = keyring.getPair(senderAddress);

    // retrieve nonce for the account
    api.query.system
      .accountNonce(senderAddress)
      .pipe(
         first(),
         // pipe nonce into transfer
         switchMap(nonce =>
           api.tx.balances
             // create transfer
             .transfer(recipientAddress, amount)
             // sign the transcation
             .sign(senderPair, { nonce })
             // send the transaction
             .send()
         )
      )
      // subscribe to overall result
      .subscribe(({ status, type }) => {
        if (type === 'Finalised') {
          console.log('Completed at block hash', status.asFinalised.toHex());
        } else {
          console.log(`Staus of transfer: ${type}`);
        }
      });
  }

  openSelectAccountsModal = () => {
    this.setState({
      open: true
    });
  }

  isValidAddress = (address: string) => {
    return address[0] === '5' && address.length === 48;
  }

  render () {
    const { amount, isAddressValid, recipientAddress, recipientName } = this.state;

    return (
      <Grid>
        <Grid.Row centered>
          <Header> Transfer Balance </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width='6'>
            <Stacked>
              <Step.Group vertical>
                <Step completed={isAddressValid}>
                  <Step.Title> Recipient </Step.Title>
                  <Icon name='address book' color='blue' />
                  <Step.Content>
                    <MarginTop />
                    <Stacked>
                      <AddressSummary address={recipientAddress} name={recipientName} size='small' />
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
            </Stacked>
          </Grid.Column>

          <Grid.Column width='10'>
            <Saved onSelectAddress={this.onSelectAddress} {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
