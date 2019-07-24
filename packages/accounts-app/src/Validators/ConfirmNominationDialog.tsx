// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Option, StakingLedger } from '@polkadot/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { AppContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { FadedText, FlexItem, Icon, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpaceAround, AddressSummary } from '@substrate/ui-components';
import React, { useState, useEffect, useContext, useReducer } from 'react';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
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

const eligibleAccountsReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_CONTROLLER':
      return {
        ...state,
        controllers: state.controller.concat(action.controller)
      };
    case 'ADD_STASH':
      return {
        ...state,
        stashes: state.stashes.concat(action.stash)
      };
    default:
      return state;
  }
};

export function ConfirmNominationDialog (props: Props) {
  const { api, keyring } = useContext(AppContext);
  // const { enqueue } = useContext(TxQueueContext);
  const [nominator, setNominator] = useState();
  const [eligibleAccounts, dispatch] = useReducer(eligibleAccountsReducer, {
    contollers: [],
    stashes: []
  });

  // list only the accounts that are either bonded (controller) or bonding (stash)
  useEffect(() => {
    const accounts: KeyringAddress[] = keyring.getAccounts();
    let multiSub: Subscription;
    accounts.map(({ address }: KeyringAddress) => {
      multiSub = (api.queryMulti([
        [api.query.staking.bonded, address], // try to map to controller
        [api.query.staking.ledger, address] // try to map to stash
      ]) as Observable<[Option<AccountId>, Option<StakingLedger>]>)
      .pipe(
        first()
      ).subscribe(([controllerId, stakingLedger]) => {
        controllerId.isSome ? dispatch({ type: 'ADD_CONTROLLER', controller: controllerId.unwrap() })
          : stakingLedger.isSome ? dispatch({ type: 'ADD_STASH', stash: stakingLedger.unwrap() })
            : dispatch({ type: 'DEFAULT' });
      });
    });

    return () => multiSub.unsubscribe();
  }, []);

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
            <SubHeader>Eligible Accounts:</SubHeader>
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
