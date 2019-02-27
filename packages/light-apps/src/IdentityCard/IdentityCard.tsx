// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { stringUpperFirst } from '@polkadot/util';
import { ApiContext, Subscribe } from '@substrate/ui-api';
import { Address, AddressSummary, BalanceDisplay, ErrorText, FadedText, Header, Icon, Input, MarginTop, Modal, NavButton, Stacked, StackedHorizontal, StyledLinkButton, SuccessText, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { StyledCard, CardContent } from './IdentityCard.styles';

interface Props extends RouteComponentProps { }

type State = {
  address?: string,
  backupModalOpen: boolean,
  buttonText?: string
  error?: string,
  forgetModalOpen: boolean,
  name?: string
  password: string,
  success?: string
};

export class IdentityCard extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    backupModalOpen: false,
    forgetModalOpen: false,
    password: ''
  };

  componentDidMount () {
    const { keyring } = this.context;

    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    const to = currentLocation === 'identity' ? 'transfer' : 'identity';
    const buttonText = stringUpperFirst(to);

    const address = this.getAddress();
    const name = address && keyring.getAccount(address).getMeta().name;

    this.setState({
      address,
      buttonText,
      name
    });
  }

  closeBackupModal = () => {
    this.setState({
      backupModalOpen: false,
      password: ''
    });
  }

  closeForgetModal = () => {
    this.setState({ forgetModalOpen: false });
  }

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
  }

  openBackupModal = () => {
    this.setState({ backupModalOpen: true });
  }

  openForgetModal = () => {
    this.setState({ forgetModalOpen: true });
  }

  // Note: this violates the "order functions alphabetically" rule of thumb, but makes it more readable
  // to have it all in the same place.
  backupTrigger = <StyledLinkButton onClick={this.openBackupModal}>Backup</StyledLinkButton>;
  forgetTrigger = <StyledLinkButton onClick={this.openForgetModal}>Forget</StyledLinkButton>;

  private backupCurrentAccount = () => {
    const { keyring } = this.context;
    const { password } = this.state;
    const address = this.getAddress();

    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      this.closeBackupModal();
      this.onSuccess('Successfully backed up account to json keyfile!');
    } catch (e) {
      this.closeBackupModal();
      this.onError(e.message);
    }
  }

  private forgetCurrentAccount = () => {
    const { keyring } = this.context;
    const { history } = this.props;
    const address = this.getAddress();

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      this.closeForgetModal();

      history.push('/identity');
    } catch (e) {
      this.onError(e.message);
    }
  }

  private handleToggleApp = () => {
    const { location, history } = this.props;
    const address = this.getAddress();
    const currentLocation = location.pathname.split('/')[1].toLowerCase();

    console.log('current location -> ', currentLocation);

    const to = currentLocation === 'identity' ? 'transfer' : 'identity';
    const buttonText = stringUpperFirst(to);

    console.log('to -> ', to);
    console.log('button => ', buttonText);

    const nextLocation = {
      pathname: `/${to}/${address}`,
      state: {
        buttonText: buttonText
      }
    };

    history.push(nextLocation);
  }

  private onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: value });
  }

  private onError = (value: string) => {
    this.setState({ error: value, success: undefined });
  }

  private onSuccess = (value: string) => {
    this.setState({ error: undefined, success: value });
  }

  render () {
    const { api } = this.context;
    const { address, buttonText, name } = this.state;

    return (
      <StyledCard>
        <CardContent>
          <Header> Current Account </Header>
          {address
            ?
            <React.Fragment>
              <AddressSummary address={address} name={name} />
              <Subscribe>
                {
                  // FIXME using any because freeBalance gives a Codec here, not a Balance
                  // Wait for @polkadot/api to have TS support for all query.*
                  api.query.balances.freeBalance(address).pipe(map(this.renderBalance as any))
                }
              </Subscribe>
            </React.Fragment>
            : <div>Loading...</div>
          }
          <MarginTop />
          <Stacked>
            <Address address={address} />
            <MarginTop />
            <StackedHorizontal>
              {this.renderForgetConfirmationModal()}
              or
              {this.renderBackupConfirmationModal()}
            </StackedHorizontal>
          </Stacked>
          <MarginTop />
          <NavButton value={buttonText} onClick={this.handleToggleApp} />
        </CardContent>
        {this.renderError()}
        {this.renderSuccess()}
      </StyledCard>
    );
  }

  renderBackupConfirmationModal () {
    const { backupModalOpen, password } = this.state;

    return (
      <Modal closeOnDimmerClick closeOnEscape open={backupModalOpen} trigger={this.backupTrigger}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader> Please Confirm You Want to Backup this Account </Modal.SubHeader>
            <FadedText>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </FadedText>
            <Modal.Actions>
              <Stacked>
                <FadedText> Please encrypt your account first with the account's password. </FadedText>
                <Input fluid min={8} onChange={this.onChangePassword} type='password' value={password} />
                <StackedHorizontal>
                  <WithSpaceBetween>
                    <StyledLinkButton onClick={this.closeBackupModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                    <StyledLinkButton onClick={this.backupCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText></StyledLinkButton>
                  </WithSpaceBetween>
                </StackedHorizontal>
              </Stacked>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  }

  renderBalance = (balance: Balance) => {
    return <BalanceDisplay balance={balance} />;
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }

  renderForgetConfirmationModal () {
    const { forgetModalOpen } = this.state;

    return (
      <Modal closeOnDimmerClick={true} closeOnEscape={true} open={forgetModalOpen} trigger={this.forgetTrigger}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader> Please Confirm You Want to Forget this Account </Modal.SubHeader>
            <b>By pressing confirm, you will be removing this account from your Saved Accounts. </b>
            <MarginTop />
            <FadedText> You can restore this later from your mnemonic phrase or json backup file. </FadedText>
            <Modal.Actions>
              <StackedHorizontal>
                <StyledLinkButton onClick={this.closeForgetModal}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
                <StyledLinkButton onClick={this.forgetCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
              </StackedHorizontal>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  }

  renderSuccess () {
    const { success } = this.state;

    return (
      <SuccessText>
        {success}
      </SuccessText>
    );
  }
}
