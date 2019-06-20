
import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance, Exposure, Option } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, FlexItem, Loading, Modal, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpace } from '@substrate/ui-components';
import React, { useEffect, useState, useContext } from 'react';
import { combineLatest, Observable, Subscription } from 'rxjs';

interface Props {
  address: string,
  name: string
}

interface State {
  controllerId?: string,
  sessionId?: string,
  stashActive?: any,
  stakers?: Exposure,
  stashId?: string,
  stashTotal: string
}

export function AccountsOverviewDetailed (props: Props) {
  const { address, name } = props;  
  const { api } = useContext(AppContext);
  const [controllers, setControllers] = useState<[AccountId[], Option<AccountId>[]]>();
  // const [nominating, setNominating] = useState();
  const [stakingInfo, setStakingInfo] = useState<DerivedStaking>();
  const [state, setState] = useState<State>();

  useEffect(() => {
    let subscription: Subscription = 
      combineLatest([
        (api.derive.staking.controllers(address) as unknown as Observable<[AccountId[], Option<AccountId>[]]>),
        (api.derive.staking.info(address) as Observable<DerivedStaking>)
      ]).subscribe(([controllers, stakingInfo]) => {
        setControllers(controllers);
        setStakingInfo(stakingInfo);
      });
  
    return () => subscription.unsubscribe();
  }, [api]);

  console.log(controllers);

  useEffect(() => {
    if (!stakingInfo) {
      return;
    }

    const { controllerId, nextSessionId, stakers, stashId, stakingLedger } = stakingInfo;

    const state = {
      controllerId: controllerId && controllerId.toString(),
      sessionId: nextSessionId && nextSessionId.toString(),
      stashActive: stakingLedger ? formatBalance(stakingLedger.active) : formatBalance(new Balance(0)),
      stakers,
      stashId: stashId && stashId.toString(),
      stashTotal: stakingLedger ? formatBalance(stakingLedger.total) : formatBalance(new Balance(0))
    }

    setState(state);

    return;
  }, [stakingInfo])

  // const getNominators = () => {
  //   return stakingInfo && stakingInfo.stakers
  //     ? stakingInfo.stakers.others.map(({ who, value }: any): [AccountId, Balance] => [who, value])
  //     : [];
  // }

  // const iNominated = () => {
  //   const nominators = getNominators();
  //   const myAddresses = keyring.getAccounts().map(({ address }) => address);

  //   return nominators.some(([who]: any) =>
  //     myAddresses.includes(who.toString())
  //   );
  // }

  return (
    <Modal trigger={<StyledLinkButton>Show More</StyledLinkButton>}>
      <Modal.Header>Details About: {address}</Modal.Header>
      <Modal.Content>
        <StackedHorizontal>
          <FlexItem><AddressSummary address={address} detailed name={name} size='medium' /></FlexItem>
          {
            !state
            ? <Loading active={false} inline />
              : <FlexItem>
                <Stacked justifyContent='space-between' alignItems='flex-start'>
                  {
                    state && state.controllerId === address
                      ? <WithSpace><SubHeader>Stash:</SubHeader> <AddressSummary address={state && state.stashId} size='small' orientation='horizontal' /></WithSpace>
                      : state && state.stashId === address
                        ? <WithSpace><SubHeader>Controller:</SubHeader><AddressSummary address={state && state.controllerId} size='small' orientation='horizontal' /></WithSpace>
                        : <WithSpace><SubHeader>Account is not bonded.</SubHeader></WithSpace>
                  }
                  <WithSpace><SubHeader>Stash Active:</SubHeader> <FadedText>{state && state.stashActive}</FadedText> </WithSpace>
                  <WithSpace><SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(state && state.stakers && state.stakers.total)}</FadedText> </WithSpace>
                  <WithSpace><SubHeader>Stash Total:</SubHeader> <FadedText>{state && state.stashTotal} </FadedText></WithSpace>
                </Stacked>
              </FlexItem>
          }
          
        </StackedHorizontal>
      </Modal.Content>
    </Modal>
  );
}

// interface State {
//   controllerId?: string,
//   sessionId?: string,
//   stashActive?: any,
//   stakers?: Exposure,
//   stashId?: string,
//   stashTotal: string
// }