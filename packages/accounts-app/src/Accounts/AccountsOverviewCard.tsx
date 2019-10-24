// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AlertsContext, AppContext, handler, StakingContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, Icon, Input, Margin, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import H from 'history';
import FileSaver from 'file-saver';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

interface Props {
  address: string;
  history: H.History;
  name?: string;
}

export function AccountsOverviewCard (props: Props) {
  const { address, history, name } = props;
  const { keyring } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);
  const { accountStakingMap } = useContext(StakingContext);
  const [bondingPair, setBondingPair] = useState<AccountId>();
  const [confirmScreen, setConfirmScreen] = useState();
  const [password, setPassword] = useState();

  const derivedStakingInfo = accountStakingMap[address];

  useEffect(() => {
    const accountType = fromNullable(derivedStakingInfo).map(stakingInfo => createType('AccountId', address) === stakingInfo.controllerId ? 'controller' : 'stash');
    const bondingPair = fromNullable(derivedStakingInfo)
      .map(stakingInfo => accountType.fold(
        undefined,
        (accountType) => accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId
      ))
      .getOrElse(undefined);

    setBondingPair(bondingPair);
  }, []);

  const handleBackup = () => {
    if (confirmScreen !== 'backup') {
      setConfirmScreen('backup');
      return;
    }

    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      enqueue({ content: 'Successfully backed up account to json keyfile!', type: 'success' });
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  };

  const handleCancel = () => {
    if (confirmScreen) {
      setConfirmScreen(null);
    }
  };

  const handleForget = () => {
    if (confirmScreen !== 'forget') {
      setConfirmScreen('forget');
      return;
    }

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      history.push('/');
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  };

  const navToBalances = () => {
    history.push(`/manageAccounts/${address}/balances`);
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
                <StyledLinkButton onClick={handleCancel}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
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
              <StyledLinkButton onClick={handleCancel}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
              <StyledLinkButton onClick={handleForget}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
            </StackedHorizontal>
          </Card.Description>
        </Stacked>
      </WithSpaceAround>
    );
  };

  return (
    <React.Fragment>
      <Card height='30rem'>
        {
          confirmScreen
            ? <React.Fragment>
              <Card.Content>
                <SubHeader>Are You Sure?</SubHeader>
                {
                  confirmScreen === 'backup'
                    ? renderConfirmBackup()
                    : renderConfirmForget()
                }
              </Card.Content>
            </React.Fragment>
            : <React.Fragment>
              <Card.Content>
                <AddressSummary address={address} bondingPair={bondingPair && bondingPair.toString()} detailed name={name} size='small' />
                <Margin bottom />
                <StackedHorizontal><StyledLinkButton onClick={navToBalances}>Show More</StyledLinkButton></StackedHorizontal>
                <WithSpaceAround>
                  <StackedHorizontal>
                    <StyledLinkButton onClick={handleForget}>
                      <Icon name='remove' />
                      Forget
                    </StyledLinkButton>
                    <StyledLinkButton onClick={handleBackup}>
                      <Icon name='arrow alternate circle down' />
                      Backup
                    </StyledLinkButton>
                  </StackedHorizontal>
                </WithSpaceAround>
              </Card.Content>
            </React.Fragment>
        }
      </Card>
    </React.Fragment>
  );
}
