// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';
import { AppContext, AlertsContext, TxQueueContext, validate } from '@substrate/ui-common';
import { Dropdown, DropdownProps, Header, Input, Stacked, SubHeader, WithSpaceAround, StyledNavButton } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription, Observable, zip } from 'rxjs';
import { take } from 'rxjs/operators';

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  controller: string;
  stash: string;
}

type RewardDestinationOption = {
  text?: string,
  value?: number
};

export const rewardDestinationOptions = [
  { text: 'Send rewards to my Stash account and immediately use it to stake more.', value: 0 },
  { text: 'Send rewards to my Stash account but do not stake any more.', value: 1 },
  { text: 'Send rewards to my Controller account.', value: 2 }
];

export function Bond (props: Props) {
  const { api, keyring } = useContext(AppContext);
  const { enqueue: alert } = useContext(AlertsContext);
  const { enqueue } = useContext(TxQueueContext);
  const [bond, setBond] = useState<BN>(new BN(0));
  const [controllerBalance, setControllerBalance] = useState<DerivedBalances>();
  const [stashBalance, setStashBalance] = useState<DerivedBalances>();
  const [destination, setDestination] = useState<RewardDestinationOption>(rewardDestinationOptions[0]);
  const [fees, setFees] = useState<DerivedFees>();
  const [nonce, setNonce] = useState<Index>();

  const { history } = props;
  const { controller, stash } = history.location.state;

  // use api.consts when it is availabe in @polkadot/api
  useEffect(() => {
    if (!stash) {
      return;
    }

    const subscription: Subscription = zip(
      api.derive.balances.fees() as Observable<DerivedFees>,
      api.derive.balances.votingBalance(stash) as Observable<DerivedBalances>,
      api.derive.balances.votingBalance(controller) as Observable<DerivedBalances>,
      api.query.system.accountNonce(stash) as Observable<Index>
    ).pipe(
      take(1)
    ).subscribe(([fees, stashBalance, controllerBalance, nonce]) => {
      setControllerBalance(controllerBalance);
      setStashBalance(stashBalance);
      setFees(fees);
      setNonce(nonce);
    });

    return () => subscription.unsubscribe();
  }, [stash, controller]);

  const handleConfirmBond = () => {
    if (isUndefined(fees)) {
      alert({ type: 'error', content: 'calculating fees...please try again in a bit.' });
      return;
    }

    if (isUndefined(stash)) {
      return;
    }

    if (isUndefined(destination)) {
      return;
    }

    // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
    const extrinsic = api.tx.staking.bond(stash, bond, destination.value);
    // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
    const values = validate({ amountAsString: bond.toString(), accountNonce: nonce, currentBalance: stashBalance, extrinsic, fees, recipientBalance: controllerBalance, currentAccount: stash, recipientAddress: controller }, api);

    values.fold(
      (errors: any) => alert({ type: 'error', content: errors }),
      (allExtrinsicData: any) => {
        const { extrinsic, amount, allFees, allTotal, recipientAddress: controller } = allExtrinsicData;

        const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(stash), recipientAddress: controller };

        enqueue(extrinsic, details);
      }
    );
  };

  const handleSetBond = ({ currentTarget: { value } }: React.SyntheticEvent<HTMLInputElement>) => !isUndefined(value) ? setBond(new BN(value)) : setBond(new BN(0));

  const onSelect = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setDestination(rewardDestinationOptions[data.value as number]);
  };

  // TODO: show the selected bond amount as percentage of total balance

  // TODO: allow to set bond amount in terms of percentage of total balance
  return (
    <Stacked>
      <Header>Bonding Preferences </Header>
      <WithSpaceAround>
        <SubHeader>How much do you wish to stake?</SubHeader>
        <Input
          label='Set Amount to Stake.'
          onChange={handleSetBond}
          placholder='The total amount of the Stash balance that will be at stake in any forthcoming eras (rewards are distributed in proportion to stake).'
          value={bond.toNumber()}
          />
      </WithSpaceAround>
      <WithSpaceAround>
        <SubHeader> How would you like to have your share of the rewards deposited back to you?</SubHeader>
        <Dropdown
          fluid
          onChange={onSelect}
          options={rewardDestinationOptions}
          text={destination.text}
          value={destination.text}
        />
      </WithSpaceAround>
      <WithSpaceAround>
        <StyledNavButton onClick={handleConfirmBond}>Confirm</StyledNavButton>
      </WithSpaceAround>
    </Stacked>
  );
}
