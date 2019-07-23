// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { Nonce, Balance, AccountId } from '@polkadot/types';
import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
// import { AppContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { StyledNavButton, SubHeader, WithSpaceAround, Stacked, Icon, StyledLinkButton, FadedText, StackedHorizontal, WithSpaceBetween, FlexItem } from '@substrate/ui-components';
import React, { useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';
// import { combineLatest, Observable, Subscription } from 'rxjs';
// import { DerivedFees } from '@polkadot/api-derive/types';

export const InputAddress = styled(PolkadotInputAddress)`
  .dropdown {
    min-width: 0;
    width: '25%';
  }
`;

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
  // const { api } = useContext(AppContext);
  // const { enqueue } = useContext(TxQueueContext);
  const [controller, setController] = useState();
  const [stash, setStash] = useState();

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
            <FlexItem>
              <InputAddress
                label={'Stash:'}
                onChange={setStash}
                type='account'
                value={stash}
                withLabel={true}
              />
            </FlexItem>
            <FlexItem>
              <InputAddress
                disabled
                label={'Controller:'}
                onChange={setController}
                type='account'
                value={controller}
                withLabel={true}
              />
            </FlexItem>
            <FlexItem>
              <StackedHorizontal>
                <WithSpaceBetween>
                  <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                  <StyledNavButton onClick={onConfirm}><Icon name='checkmark' color='green' /> <FadedText>Confirm Nomination</FadedText></StyledNavButton>
                </WithSpaceBetween>
              </StackedHorizontal>
            </FlexItem>
          </Stacked>
        </Modal.Actions>
      </WithSpaceAround>
    </Modal>
  );
}