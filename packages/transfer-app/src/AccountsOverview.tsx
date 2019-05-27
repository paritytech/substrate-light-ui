// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, handler, AlertsContext } from '@substrate/ui-common';
import { AddressSummary, Card, FadedText, Grid, Icon, Margin, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Input } from 'semantic-ui-react';

interface IProps extends RouteComponentProps {}

type AccountOverviewActionTypes = 'forget' | 'backup' | null;

function AccountsOverviewCard (props: any) {
  const { address, history, name } = props;
  const { keyring } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);
  const [actionType, setActionType] = useState();
  const [password, setPassword] = useState();

  const handleAction = (actionType: AccountOverviewActionTypes) => {
    setActionType(actionType);
  };

  const handleBackup = () => {
    const pair = keyring.getPair(address);
    const json = keyring.backupAccount(pair, password);
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, `${address}.json`);

    handleAction(null);

    enqueue({ content: 'Successfully backed up account to json keyfile!', type: 'success' });
  };

  const handleForget = () => {
    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      handleAction(null);

      history.push('/');
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  };

  const renderConfirmBackup = () => {
    return (
      <WithSpaceAround>
        <SubHeader> Please Confirm You Want to Backup this Account </SubHeader>
        <FadedText>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </FadedText>
        <Card.Description>
          <Stacked>
            <FadedText> Please encrypt your account first with the account's password. </FadedText>
            <Input onChange={handler(setPassword)} type='password' value={password} />
            <StackedHorizontal>
              <WithSpaceBetween>
                <StyledLinkButton onClick={() => handleAction(null)}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                <StyledLinkButton onClick={handleBackup}><Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText></StyledLinkButton>
              </WithSpaceBetween>
            </StackedHorizontal>
          </Stacked>
        </Card.Description>
      </WithSpaceAround>
    );
  };

  const renderConfirmForget = () => {
    return (
      <WithSpaceAround>
        <Stacked>
          <SubHeader> Please Confirm You Want to Forget this Account </SubHeader>
          <b>By pressing confirm, you will be removing this account from your Saved Accounts. </b>
          <Margin top />
          <FadedText> You can restore this later from your mnemonic phrase or json backup file. </FadedText>
          <Card.Description>
            <StackedHorizontal>
              <StyledLinkButton onClick={() => handleAction(null)}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
              <StyledLinkButton onClick={handleForget}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
            </StackedHorizontal>
          </Card.Description>
        </Stacked>
      </WithSpaceAround>
    );
  };

  return (
    <Card height='20rem'>
      {
        actionType
          ? <React.Fragment>
              <Card.Content>
                <SubHeader>Are You Sure?</SubHeader>
                {
                  actionType === 'backup'
                    ? renderConfirmBackup()
                    : renderConfirmForget()
                }
              </Card.Content>
            </React.Fragment>
          : <React.Fragment>
              <Card.Content><AddressSummary address={address} name={name} size='medium' /></Card.Content>
              <WithSpaceAround>
                <Card.Description>
                  <StackedHorizontal>
                    <StyledLinkButton onClick={() => handleAction('forget')}>
                      <Icon name='remove' />
                      Forget
                    </StyledLinkButton>
                    <StyledLinkButton onClick={() => handleAction('backup')}>
                      <Icon name='arrow alternate circle down' />
                      Backup
                    </StyledLinkButton>
                  </StackedHorizontal>
                </Card.Description>
              </WithSpaceAround>
            </React.Fragment>
      }
    </Card>
  );
}

export function AccountsOverview (props: IProps) {
  const { history } = props;
  const { keyring } = useContext(AppContext);

  const renderAccountCard = (address: string, name: string) => {
    return (
      <Grid.Column width='5'>
        <AccountsOverviewCard address={address} name={name} history={history} />
      </Grid.Column>
    );
  };

  return (
    <Grid>
      <Grid.Row celled>
       {
          keyring.getPairs().slice(4).map((pair) => {
            return renderAccountCard(pair.address(), pair.getMeta().name);
          })
       }
      </Grid.Row>
    </Grid>
  );
}
