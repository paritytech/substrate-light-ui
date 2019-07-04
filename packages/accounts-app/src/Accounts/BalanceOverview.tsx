// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from "react";
import { AddressSummary, FadedText, Grid, Stacked, SubHeader, WithSpace, StyledLinkButton } from "@substrate/ui-components";
import { formatBalance } from "@polkadot/util";
import { Exposure } from "@polkadot/types";

interface Props {
  address: string;
  controllerId: string;
  stashId: string;
  stakers: Exposure;
  stashActive: any;
  stashTotal: string;
}

export function BalanceOverview (props: Props) {
  const { address, controllerId, stakers, stashId, stashActive, stashTotal } = props;
  
  const renderUnBondedAccountOptions = () => {
    return (
      <WithSpace>
        <SubHeader>Account is not bonded.</SubHeader>
        <StyledLinkButton>Choose Staking Options</StyledLinkButton>
      </WithSpace>
    );
  };

  return (
    <Grid.Column width='5'>
      <Stacked justifyContent='flex-start' alignItems='flex-start'>
        {
          controllerId === address
            ? <WithSpace><SubHeader>Stash:</SubHeader> <AddressSummary address={stashId} size='small' orientation='horizontal' /></WithSpace>
            : stashId === address
              ? <WithSpace><SubHeader>Controller:</SubHeader><AddressSummary address={controllerId} size='small' orientation='horizontal' /></WithSpace>
              : renderUnBondedAccountOptions()
        }
        <WithSpace><SubHeader>Stash Active:</SubHeader> <FadedText>{stashActive}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(stakers && stakers.total)}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Bonded:</SubHeader> <FadedText>{stashTotal} </FadedText></WithSpace>
      </Stacked>
    </Grid.Column>
  );
}
