// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, Index } from '@polkadot/types';
import { AppContext, StakingContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { Address, AddressSummary, Card, FadedText, Header, Icon, Margin, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import H from 'history';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import { Observable, Subscription, combineLatest } from 'rxjs';

interface Props {
  history: H.history;
  nominatee: string;
}

// TODO: p3 refactor all this to smaller components
export function ConfirmNominationDialog (props: Props) {
  const { nominatee } = props;
  const { api, keyring } = useContext(AppContext);
  const { onlyBondedAccounts } = useContext(StakingContext);
  const { enqueue } = useContext(TxQueueContext);
  const [nominateWith, setNominateWith] = useState();

  const handleAccountSelected = ({ currentTarget: { dataset: { account } } }: React.MouseEvent<HTMLElement>) => {
    setNominateWith(account);
  };

  const onConfirm = () => {
    const subscription: Subscription = combineLatest([
      (api.derive.balances.fees() as Observable<DerivedFees>),
      api.query.system.accountNonce(nominateWith) as Observable<Index>,
      api.derive.balances.votingBalance(nominateWith) as Observable<DerivedBalances>,
      api.derive.balances.votingBalance(nominatee) as Observable<DerivedBalances>
    ])
    .subscribe(([fees, nonce, currentBalance, recipientBalance]) => {
      const extrinsic = api.tx.staking.nominate(nominatee);
      // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
      const values = validateDerived({
        accountNonce: nonce,
        amount: ,
        currentBalance,
        extrinsic,
        fees,
        recipientBalance
      });

      debugger;
    });
  };

  const renderBondedAccountOption = (account: AccountId | string) => {
    // TODO: p2 put this logic somewhere else so it's reusable
    const stakingInfo = onlyBondedAccounts[account.toString()];
    const accountType = stakingInfo.accountId === stakingInfo.controllerId ? 'controller' : 'stash';
    const bondingPair = accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId;

    return (
      <WithSpace>
        <Card height='14rem' onClick={handleAccountSelected} data-account={account.toString()}>
          <AddressSummary
            address={account.toString()}
            bondingPair={bondingPair && bondingPair.toString()}
            name={
              fromNullable(keyring.getAccount(account.toString()))
                .chain(account => some(account.meta))
                .chain(meta => some(meta.name))
                .getOrElse(undefined)}
            orientation='vertical'
            size='small'
            type={accountType}
          />
        </Card>
      </WithSpace>
    );
  };

  const renderChooseAccount = () => {
    return (
      <React.Fragment>
      <Header>Select the Account You Wish to Nominate With:</Header>
      <Modal.Actions>
        <Stacked>
          <StackedHorizontal justifyContent='flex-start' alignItems='flex-start'>
            <WithSpace>
              <Stacked>
                <SubHeader>Bonded Accounts</SubHeader>
                <StackedHorizontal justifyContent='space-around' alignItems='stretch'>
                  {
                    fromNullable(onlyBondedAccounts)
                      .map(bonded => Object.keys(bonded))
                      .map(accounts => accounts.map(renderBondedAccountOption))
                      .getOrElse([].map(renderNoBondedAccounts))
                  }
                </StackedHorizontal>
              </Stacked>
            </WithSpace>
          </StackedHorizontal>
          <FadedText>If you don't see an account listed here, you should make sure it is bonded before you can nominate with it.</FadedText>
        </Stacked>
      </Modal.Actions>
      </React.Fragment>
    );
  };

  const renderConfirmDetails = () => {
    return (
      <React.Fragment>
        <Header>Confirm Details and Nominate!</Header>
        <Stacked><SubHeader>Nominate With: </SubHeader> <Address address={nominateWith}></Address></Stacked>
        <Margin top='huge' />
        <StackedHorizontal>
          <Stacked>
            <FadedText> Nominator </FadedText>
            <AddressSummary address={nominateWith} detailed name={
              fromNullable(keyring.getAccount(nominateWith.toString()))
                .chain(account => some(account.meta))
                .chain(meta => some(meta.name))
                .getOrElse(undefined)
            } orientation='vertical' />
          </Stacked>
          
          <Margin left />
          <Stacked>
            <FadedText> Validator </FadedText>
            <AddressSummary address={nominatee} detailed name={
              fromNullable(keyring.getAddress(nominatee.toString()))
                .chain(account => some(account.meta))
                .chain(meta => some(meta.name))
                .getOrElse(undefined)
            } />
          </Stacked>
        </StackedHorizontal>
        <Margin top />
        <Stacked>
          <StackedHorizontal>
            <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
            <Margin left />
            <StyledNavButton onClick={onConfirm}><Icon name='checkmark' color='green' /> Confirm </StyledNavButton>
          </StackedHorizontal>
          <Margin bottom />
          <StyledLinkButton onClick={() => setNominateWith(undefined)}>Change Account</StyledLinkButton>
        </Stacked>
      </React.Fragment>
    );
  };

  const renderNoBondedAccounts = () => {
    const navToStakingOptions = () => {
      const currentAccount = location.pathname.split('/')[2];
      props.history.push(`/accountManagement/${currentAccount}/staking/setup`);
    };

    return (
      <React.Fragment>
        No bonded accounts in your keyring.
        <Margin top='large' />
        <StyledNavButton onClick={navToStakingOptions}>Bond</StyledNavButton>
      </React.Fragment>
    );
  };

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      trigger={<StyledNavButton> Nominate </StyledNavButton>}
    >
      <WithSpaceAround>
        {
          nominateWith
            ? renderConfirmDetails()
            : renderChooseAccount()
        }
      </WithSpaceAround>
    </Modal>
  );
}
