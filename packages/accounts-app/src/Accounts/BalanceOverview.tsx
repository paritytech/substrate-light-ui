// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, Index } from '@polkadot/types';
import { DerivedStaking } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import { AlertsContext, AppContext, StakingContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { AddressSummary, FadedText, Grid, Input, Stacked, SubHeader, WithSpace, StyledLinkButton } from '@substrate/ui-components';
import { fromNullable, some } from 'fp-ts/lib/Option';
import H from 'history';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

interface Props extends DerivedStaking {
  history: H.History;
}

export function BalanceOverview (props: Pick<Props, Exclude<keyof Props, keyof 'validatorPrefs'>>) {
  const { accountId, controllerId, history, stakers, stashId, stakingLedger } = props;
  const { enqueue: alert } = useContext(AlertsContext);
  const { api, keyring } = useContext(AppContext);
  const { derivedBalanceFees } = useContext(StakingContext);
  const { enqueue } = useContext(TxQueueContext);
  const [controllerBalance, setControllerBalance] = useState();
  const [controllerNonce, setControllerNonce] = useState();
  const [unbondAmount, setUnbondAmount] = useState(0);

  useEffect(() => {
    if (!controllerId) { return; }
    const subscription: Subscription = combineLatest([
      (api.query.balances.freeBalance(controllerId) as Observable<Balance>),
      (api.query.system.accountNonce(controllerId) as Observable<Index>)
    ])
      .pipe(
        take(1)
      ).subscribe(([controllerBalance, controllerNonce]) => {
        setControllerBalance(controllerBalance);
        setControllerNonce(controllerNonce);
      });

    return subscription.unsubscribe();
  }, [controllerId]);

  const renderUnBondedAccountOptions = () => {
    return (
      <WithSpace>
        <SubHeader>Account is not bonded.</SubHeader>
        <StyledLinkButton onClick={() => history.push(`/manageAccounts/${accountId}/staking`)}>Choose Staking Options</StyledLinkButton>
      </WithSpace>
    );
  };

  // N.B. You can only unbond from controller
  const unbond = () => {
    if (!controllerId) {
      alert({ type: 'error', content: 'ControllerId was not defined. You can only unbond with your controllerId.' });
      return;
    }

    if (!derivedBalanceFees) {
      return;
    }

    const unBondAmountAsBalance = new Balance(unbondAmount);
    const extrinsic = api.tx.staking.unbond(unBondAmountAsBalance);
    const values = validateDerived({
      accountNonce: controllerNonce,
      amount: unBondAmountAsBalance,
      currentBalance: controllerBalance,
      // @ts-ignore
      extrinsic,
      fees: derivedBalanceFees
    });

    values.fold(
      (errors: any) => alert({ type: 'error', content: Object.values(errors) }),
      (allExtrinsicData: any) => {
        const { extrinsic, amount, allFees, allTotal } = allExtrinsicData;

        const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(controllerId) };

        enqueue(extrinsic, details);
      }
    );
  };

  return (
    <Grid.Column width='5'>
      <Stacked justifyContent='flex-start' alignItems='flex-start'>
        {
          controllerId === accountId
            ? <WithSpace>
                <SubHeader>Stash:</SubHeader>
                <AddressSummary
                  address={stashId && stashId.toString()}
                  name={fromNullable(keyring.getAccount(accountId.toString()))
                        .chain(account => some(account.meta))
                        .chain(meta => some(meta.name))
                        .getOrElse(undefined)}
                  orientation='horizontal'
                  size='small'
                />
              </WithSpace>
            : stashId === accountId
              ? <WithSpace>
                  <SubHeader>Controller:</SubHeader>
                  <AddressSummary
                    address={controllerId && controllerId.toString()}
                    name={fromNullable(keyring.getAccount(accountId.toString()))
                      .chain(account => some(account.meta))
                      .chain(meta => some(meta.name))
                      .getOrElse(undefined)}
                    orientation='horizontal'
                    size='small'
                  />
                </WithSpace>
              : renderUnBondedAccountOptions()
        }
        <WithSpace><SubHeader>Stash Active:</SubHeader> <FadedText>{stakingLedger && formatBalance(stakingLedger.active)}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(stakers && stakers.total)}</FadedText> </WithSpace>
        <WithSpace><SubHeader>Bonded:</SubHeader> <FadedText>{stakingLedger && formatBalance(stakingLedger.total)} </FadedText></WithSpace>
        <WithSpace>
          <Stacked><Input disabled={controllerId !== accountId} onChange={setUnbondAmount} value={unbondAmount} /> <StyledLinkButton disabled={controllerId !== accountId} onClick={unbond}>Unbond</StyledLinkButton></Stacked>
          { controllerId !== accountId && <FadedText>You can only unbond funds through your controller account.</FadedText>}
        </WithSpace>
      </Stacked>
    </Grid.Column>
  );
}
