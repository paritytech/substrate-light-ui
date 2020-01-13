// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStakingAccount } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import {
  AlertsContext,
  AllExtrinsicData,
  ApiContext,
  KeyringContext,
  StakingContext,
  TxQueueContext,
  validate,
} from '@substrate/context';
import {
  AddressSummary,
  FadedText,
  Grid,
  Input,
  Stacked,
  StyledLinkButton,
  SubHeader,
  WithSpace,
} from '@substrate/ui-components';
import BN from 'bn.js';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable, some } from 'fp-ts/lib/Option';
import H from 'history';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

interface Props extends DerivedStakingAccount {
  history: H.History;
}

export function BalanceOverview(props: Pick<Props, Exclude<keyof Props, keyof 'validatorPrefs'>>): React.ReactElement {
  const { accountId, controllerId, history, stakers, stashId, stakingLedger } = props;
  const { enqueue: alert } = useContext(AlertsContext);
  const { api } = useContext(ApiContext);
  const { keyring } = useContext(KeyringContext);
  const { derivedBalanceFees } = useContext(StakingContext);
  const { enqueue } = useContext(TxQueueContext);
  const [controllerBalance, setControllerBalance] = useState<DerivedBalances>();
  const [controllerNonce, setControllerNonce] = useState<Index>();
  const [unbondAmount, setUnbondAmount] = useState<BN>(new BN(0));
  const [status, setStatus] = useState<Either<string[], AllExtrinsicData>>();

  useEffect(() => {
    if (!controllerId) {
      return;
    }
    const subscription = combineLatest([
      api.derive.balances.votingBalance(controllerId),
      api.query.system.accountNonce<Index>(controllerId),
    ])
      .pipe(take(1))
      .subscribe(([controllerBalance, controllerNonce]) => {
        setControllerBalance(controllerBalance);
        setControllerNonce(controllerNonce);
      });

    return (): void => subscription.unsubscribe();
  }, [api.derive.balances, api.query.system, controllerId]);

  const _validate = useCallback((): Either<string[], AllExtrinsicData> => {
    const errors: string[] = [];

    if (!controllerNonce) {
      errors.push('Calculating account nonce...');
    }

    if (!controllerId) {
      errors.push('ControllerId was not defined. You can only unbond with your controllerId.');
    }

    if (!derivedBalanceFees) {
      errors.push('Calculating fees...');
    }

    const unBondAmountAsBalance = api.createType('Balance', unbondAmount);
    const extrinsic = api.tx.staking.unbond(unBondAmountAsBalance);

    if (!extrinsic) {
      errors.push('There was an issue constructing the extrinsic...');
    }

    if (!controllerId) {
      return left(['`controllerId` is undefined']);
    }

    if (errors.length) {
      return left(errors);
    }

    const values = validate({
      amountAsString: unbondAmount.toString(),
      accountNonce: controllerNonce,
      currentBalance: controllerBalance,
      // FIXME https://github.com/paritytech/substrate-light-ui/issues/709
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      extrinsic,
      fees: derivedBalanceFees,
      currentAccount: controllerId.toString(),
    });

    return values.fold(
      () => left(errors),
      allExtrinsicData => right(allExtrinsicData)
    );
  }, [api, controllerBalance, controllerId, controllerNonce, derivedBalanceFees, unbondAmount]);

  useEffect(() => {
    setStatus(_validate());
  }, [_validate, controllerBalance, controllerId, controllerNonce, derivedBalanceFees]);

  const renderUnBondedAccountOptions = (): React.ReactElement => {
    return (
      <WithSpace>
        <SubHeader>Account is not bonded.</SubHeader>
        <StyledLinkButton onClick={(): void => history.push(`/manageAccounts/${accountId}/staking`)}>
          Choose Staking Options
        </StyledLinkButton>
      </WithSpace>
    );
  };

  // N.B. You can only unbond from controller
  const unbond = (): void => {
    if (!controllerId) {
      return;
    }
    fromNullable(status)
      .map(_validate)
      .map(status =>
        status.fold(
          errors => alert({ type: 'error', content: Object.values(errors) }),
          allExtrinsicData => {
            const { extrinsic, amount, allFees, allTotal } = allExtrinsicData;
            const details = {
              amount,
              allFees,
              allTotal,
              methodCall: extrinsic.meta.name.toString(),
              senderPair: keyring.getPair(controllerId.toString()),
            };
            enqueue(extrinsic, details);
          }
        )
      );
  };

  const handleSetUnbondAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setUnbondAmount(new BN(value));
  };

  return (
    <Grid.Column width='5'>
      <Stacked justifyContent='flex-start' alignItems='flex-start'>
        {controllerId === accountId ? (
          <WithSpace>
            <SubHeader>Stash:</SubHeader>
            <AddressSummary
              address={stashId && stashId.toString()}
              name={fromNullable(keyring.getAccount(accountId.toString()))
                .chain(account => some(account.meta))
                .chain(meta => some(meta.name))
                .getOrElse(undefined)}
              orientation='vertical'
              size='small'
            />
          </WithSpace>
        ) : stashId === accountId ? (
          <WithSpace>
            <SubHeader>Controller:</SubHeader>
            <AddressSummary
              address={controllerId && controllerId.toString()}
              name={fromNullable(keyring.getAccount(accountId.toString()))
                .chain(account => some(account.meta))
                .chain(meta => some(meta.name))
                .getOrElse(undefined)}
              orientation='vertical'
              size='small'
            />
          </WithSpace>
        ) : (
          renderUnBondedAccountOptions()
        )}
        <WithSpace>
          <SubHeader>Stash Active:</SubHeader>{' '}
          <FadedText>{stakingLedger && formatBalance(stakingLedger.active)}</FadedText>{' '}
        </WithSpace>
        <WithSpace>
          <SubHeader>Stakers Total:</SubHeader> <FadedText>{formatBalance(stakers && stakers.total)}</FadedText>{' '}
        </WithSpace>
        <WithSpace>
          <SubHeader>Bonded:</SubHeader> <FadedText>{stakingLedger && formatBalance(stakingLedger.total)} </FadedText>
        </WithSpace>
        <WithSpace>
          <Stacked>
            <Input disabled={controllerId !== accountId} onChange={handleSetUnbondAmount} value={unbondAmount} />{' '}
            <WithSpace>
              <StyledLinkButton disabled={controllerId !== accountId} onClick={unbond}>
                Unbond
              </StyledLinkButton>
            </WithSpace>
          </Stacked>
          {controllerId !== accountId && (
            <FadedText>You can only unbond funds through your controller account.</FadedText>
          )}
        </WithSpace>
      </Stacked>
    </Grid.Column>
  );
}
