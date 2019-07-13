// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isUndefined } from '@polkadot/util';
import { Dropdown, DropdownProps, Input, Stacked, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

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
  const [bond, setBond] = useState<BN>(new BN(0));
  const [destination, setDestination] = useState<RewardDestinationOption>();

  const onSelect = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setDestination(data as RewardDestinationOption);
  };

  const handleSetBond = ({ currentTarget: { value } }: React.SyntheticEvent<HTMLInputElement>) => !isUndefined(value) ? setBond(new BN(value)) : setBond(new BN(0));

  // TODO: show the selected bond amount as percentage of total balance

  // TODO: allow to set bond amount in terms of percentage of total balance
  return (
    <Stacked>
      <WithSpaceAround>
        <SubHeader>How much do you wish to stake?</SubHeader>
        <Input
          label='Set Amount to Stake.'
          onChange={handleSetBond}
          placholder='The total amount of the Stash balance that will be at stake in any forthcoming eras (rewards are distributed in proportion to stake).'
          withLabel
          value={bond.toNumber()}
          />
      </WithSpaceAround>
      <WithSpaceAround>
        <SubHeader>Which account should we deposit your share of the rewards?</SubHeader>
        <Dropdown
          label={'reward payout destination'}
          onChange={onSelect}
          options={rewardDestinationOptions}
          value={destination && destination.text}
        />
      </WithSpaceAround>
    </Stacked>
  );
}
