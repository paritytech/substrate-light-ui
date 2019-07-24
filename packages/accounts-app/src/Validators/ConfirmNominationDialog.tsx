// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { isUndefined } from '@polkadot/util';
import { AppContext, AccountDerivedStakingMap, StakingContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { AddressSummary, FadedText, Header, Icon, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
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
  const { onlyBondedAccounts } = useContext(StakingContext);
  console.log(onlyBondedAccounts);
  // const { enqueue } = useContext(TxQueueContext);
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

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      trigger={<StyledNavButton> Nominate </StyledNavButton>}
    >
      <WithSpaceAround>
        <Header>Select the Account You Wish to Nominate With:</Header>
        <Modal.Actions>
          <Stacked>
            <StackedHorizontal>
              <WithSpace>
                <Stacked>
                  <SubHeader>Bonded Accounts</SubHeader>

                </Stacked>
              </WithSpace>
            </StackedHorizontal>
            <FadedText>If you don't see your account listed here, you should make sure it is bonded before nominating with it.</FadedText>
            <StackedHorizontal>
              <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
              <StyledNavButton onClick={onConfirm}><Icon name='checkmark' color='green' /> <FadedText>Confirm</FadedText></StyledNavButton>
            </StackedHorizontal>
          </Stacked>
        </Modal.Actions>
      </WithSpaceAround>
    </Modal>
  );
}
