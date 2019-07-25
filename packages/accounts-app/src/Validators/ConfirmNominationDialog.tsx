// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';
import { AppContext, AccountDerivedStakingMap, StakingContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { Address, AddressSummary, Card, FadedText, FlexItem, Header, Icon, Margin, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

// interface Props {
//   amountAsString: string;
//   accountNonce: Nonce;
//   currentAccount: AccountId;
//   currentBalance: Balance;
//   fees: Balance;
//   recipientAddress: AccountId;
//   recipientBalance: Balance;
// }

interface Props { }

export function ConfirmNominationDialog (props: Props) {
  const { keyring } = useContext(AppContext);
  const { onlyBondedAccounts } = useContext(StakingContext);
  // const { enqueue } = useContext(TxQueueContext);

  const [nominateWith, setNominateWith] = useState();

  const handleAccountSelected = ({ currentTarget: { dataset: { account } } }: React.MouseEvent<HTMLElement>) => {
    setNominateWith(account);
  };

  const onConfirm = () => {
    // const subscription: Subscription = combineLatest([
    //   (api.derive.balances.fees() as Observable<DerivedFees>)
    // ])
    // .subscribe(([fees]) => {
      // const extrinsic = api.tx.staking.nominate(nominees);
      // // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
      // const values = validate({ amountAsString: bond.toString(), accountNonce: nonce, currentBalance: stashBalance, extrinsic, fees, recipientBalance: controllerBalance, currentAccount: stash, recipientAddress: controller }, api);
    // });
  };

  // {
  //   controllerId === address
  //     ? <WithSpace><SubHeader>Stash:</SubHeader> <AddressSummary address={stashId} size='small' orientation='horizontal' /></WithSpace>
  //     : stashId === address
  //       ? <WithSpace><SubHeader>Controller:</SubHeader><AddressSummary address={controllerId} size='small' orientation='horizontal' /></WithSpace>
  //       : renderUnBondedAccountOptions()
  // }

  const renderBondedAccountOption = (account: AccountId | string) => {
    const stakingInfo = onlyBondedAccounts[account];
    const accountType = stakingInfo.accountId === stakingInfo.controllerId ? 'controller' : 'stash';
    const bondingPair = accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId;

    return (
      <WithSpace>
        <Card height='14rem' onClick={handleAccountSelected} data-account={account.toString()}>
          <AddressSummary
            address={account.toString()}
            bondingPair={bondingPair.toString()}
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
                      .getOrElse([].map(() => <React.Fragment></React.Fragment>))
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
        <Margin top />
        <AddressSummary address={nominateWith} detailed name={
          fromNullable(keyring.getAccount(nominateWith.toString()))
            .chain(account => some(account.meta))
            .chain(meta => some(meta.name))
            .getOrElse(undefined)
        } orientation='vertical' />
        <Margin top />
        <Stacked>
          <StackedHorizontal>
            <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
            <StyledNavButton onClick={onConfirm}><Icon name='checkmark' color='green' /> <FadedText>Confirm</FadedText></StyledNavButton>
          </StackedHorizontal>
          <StyledLinkButton onClick={() => setNominateWith(undefined)}>Change Account</StyledLinkButton>
        </Stacked>
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
