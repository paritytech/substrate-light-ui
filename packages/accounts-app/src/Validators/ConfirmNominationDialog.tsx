// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Option, StakingLedger } from '@polkadot/types';
import { AppContext, BondedAccounts, StakingContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { FadedText, FlexItem, Icon, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpaceAround, AddressSummary } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useState, useEffect, useContext, useReducer } from 'react';
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
  const { bondedAccounts } = useContext(StakingContext);

  // const { enqueue } = useContext(TxQueueContext);
  const [nominator, setNominator] = useState();

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
        <SubHeader> Please Confirm Your Nomination Preferences </SubHeader>
        <Modal.Actions>
          <Stacked>
            <SubHeader>Bonded Accounts:</SubHeader>
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
