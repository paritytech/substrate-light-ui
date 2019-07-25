// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import { AddressSummary, FadedText, Grid, Stacked, SubHeader, WithSpace, StyledLinkButton } from '@substrate/ui-components';
import H from 'history';
import React from 'react';

interface Props extends DerivedStaking {
  history: H.History;
}

export function BalanceOverview (props: Pick<Props, Exclude<keyof Props, keyof 'validatorPrefs'>>) {
  const { accountId, controllerId, history, stakers, stashId, stakingLedger } = props;

  const renderUnBondedAccountOptions = () => {
    return (
      <WithSpace>
        <SubHeader>Account is not bonded.</SubHeader>
        <StyledLinkButton onClick={history.push(`/manageAccounts/${accountId}/staking`)}>Choose Staking Options</StyledLinkButton>
      </WithSpace>
    );
  };

  return (
    <Grid.Column width='5'>
      <Stacked justifyContent='flex-start' alignItems='flex-start'>
        {
          controllerId === accountId
            ? <WithSpace><SubHeader>Stash:</SubHeader> <AddressSummary address={stashId && stashId.toString()} size='small' orientation='horizontal' /></WithSpace>
            : stashId === accountId
              ? <WithSpace><SubHeader>Controller:</SubHeader><AddressSummary address={controllerId && controllerId.toString()} size='small' orientation='horizontal' /></WithSpace>
              : renderUnBondedAccountOptions()
        }
        <WithSpace><SubHeader>Stash Active:</SubHeader> <FadedText>{stakingLedger && formatBalance(stakingLedger.active)}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(stakers && stakers.total)}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Bonded:</SubHeader> <FadedText>{stakingLedger && formatBalance(stakingLedger.total)} </FadedText></WithSpace>
      </Stacked>
    </Grid.Column>
  );
}
