// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance, Exposure } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, FlexItem, Loading, Modal, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpace, Grid } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState, useContext } from 'react';
import { Observable, Subscription } from 'rxjs';

interface Props {
  address: string,
  name: string,
  handleForget: () => void,
  handleBackup: () => void
}

interface State {
  controllerId?: string,
  isStashNominating?: boolean,
  nominators?: any,
  sessionId?: string,
  stashActive?: any,
  stakers?: Exposure,
  stashId?: string,
  stashTotal: string
}

export function AccountsOverviewDetailed (props: Props) {
  const { address, name } = props;  
  const { api } = useContext(AppContext);
  const [state, setState] = useState<State>();

  useEffect(() => {
    let subscription: Subscription = 
        (api.derive.staking.info(address) as Observable<DerivedStaking>)
          .subscribe((stakingInfo: DerivedStaking) => {
            if (!stakingInfo) {
              return;
            }

            const { controllerId, nextSessionId, nominators, stakers, stashId, stakingLedger } = stakingInfo;

            const state = {
              controllerId: controllerId && controllerId.toString(),
              isStashNominating: nominators && nominators.length !== 0,
              nominators: nominators,
              sessionId: nextSessionId && nextSessionId.toString(),
              stashActive: stakingLedger ? formatBalance(stakingLedger.active) : formatBalance(new Balance(0)),
              stakers: stakers,
              stashId: stashId && stashId.toString(),
              stashTotal: stakingLedger ? formatBalance(stakingLedger.total) : formatBalance(new Balance(0))
            }

            setState(state);
          })
  
    return () => subscription.unsubscribe();
  }, [api]);

  // const getNominators = () => {
  //   return fromNullable(state)
  //     .mapNullable(({ stakers }) => stakers)
  //     .map((stakers) => stakers.others.map(({ who, value }: any): [AccountId, Balance] => [who, value]))
  //     .getOrElse([])
  // }

  const renderUnBondedAccountOptions = () => {
    return (
      <WithSpace>
        <SubHeader>Account is not bonded.</SubHeader>
        <StyledLinkButton>Choose Staking Options</StyledLinkButton>
      </WithSpace>
    )
  }

  const renderBalanceDetails = () => {
    return (
      <Grid.Column width='5'>
        <Stacked justifyContent='flex-start' alignItems='flex-start'>
          {
            state!.controllerId === address
              ? <WithSpace><SubHeader>Stash:</SubHeader> <AddressSummary address={state!.stashId} size='small' orientation='horizontal' /></WithSpace>
              : state!.stashId === address
                ? <WithSpace><SubHeader>Controller:</SubHeader><AddressSummary address={state!.controllerId} size='small' orientation='horizontal' /></WithSpace>
                : renderUnBondedAccountOptions()
          }
          <WithSpace><SubHeader>Stash Active:</SubHeader> <FadedText>{state!.stashActive}</FadedText> </WithSpace>
          <WithSpace><SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(state!.stakers && state!.stakers.total)}</FadedText> </WithSpace>
          <WithSpace><SubHeader>Bonded:</SubHeader> <FadedText>{state!.stashTotal} </FadedText></WithSpace>
        </Stacked>
      </Grid.Column>
    )
  }

  const renderDetails = () => {
    return (
      <React.Fragment>
        {renderBalanceDetails()}
        {renderNominationDetails()}
      </React.Fragment>
    )
  }

  const renderNominationDetails = () => {
    return (
      <Grid.Column width='5'>
        <WithSpace>
          <Grid.Row>
            <SubHeader>Currently Nominating:</SubHeader>
              {
                state!.isStashNominating
                && state!.nominators.map((address: AccountId) => (
                  <AddressSummary
                    address={address.toString()}
                    key={address.toString()}
                    orientation='horizontal'
                    size='small'
                  />
                ))
              }
          </Grid.Row>
        </WithSpace>
      </Grid.Column>
    )
  }


  return (
    <Modal trigger={<StyledLinkButton>Show More</StyledLinkButton>}>
      <WithSpace>
        <Modal.Header>Details About: {address}</Modal.Header>
          <Grid columns='16'>
            <Grid.Column stretched width='6'><AddressSummary address={address} detailed name={name} size='medium' /></Grid.Column>
            {
              fromNullable(state)
                .map(() => renderDetails())
                .getOrElse(<Loading active inline inverted />)
            }
          </Grid>
      </WithSpace>
    </Modal>
  );
}