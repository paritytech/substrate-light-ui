// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { u64 } from '@polkadot/types';
import { AppContext, AlertsContext, AllExtrinsicData, StakingContext, TxQueueContext, validate } from '@substrate/ui-common';
import { Address, AddressSummary, FadedText, Header, Icon, Margin, Stacked, StackedHorizontal, StyledNavButton, StyledLinkButton, SubHeader, WithSpace } from '@substrate/ui-components';
import BN from 'bn.js';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable, some } from 'fp-ts/lib/Option';
import H from 'history';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import { rewardDestinationOptions } from '../constants';
import { Errors } from '../types';
import { Validation } from '../Validation';

interface Props {
  handleSelectNominateWith: (account: string | null) => void;
  history: H.History;
  nominees: string[];
  nominateWith: string;
}

export function FinalConfirmation (props: Props) {
  const { handleSelectNominateWith, history, nominees, nominateWith } = props;
  const { api, keyring } = useContext(AppContext);
  const { enqueue: alert } = useContext(AlertsContext);
  const { derivedBalanceFees, onlyBondedAccounts } = useContext(StakingContext);
  const { enqueue, errorObservable, successObservable } = useContext(TxQueueContext);

  const _validate = (): Either<Errors, AllExtrinsicData> => {
    let errors: Errors = [];

    if (!nonce) { errors.push('Calculating account nonce...'); }

    const stakingLedger = onlyBondedAccounts[nominateWith].stakingLedger;
    const nominationAmount = stakingLedger && stakingLedger.total;

    if (!stakingLedger) { errors.push('Staking ledger is undefined... Please refresh and try again or try with a different account.'); }
    if (!nominationAmount || nominationAmount.unwrap().lte(new BN(0))) { errors.push('Nomination amount must be greater than zero.'); }

    if (errors.length) { return left(errors); }

    const extrinsic = api.tx.staking.nominate(nominees);
    const values = validate({
      amountAsString: nominationAmount!.toString(), // Nomination amount is equalized amongst nominees a la Phragmens
      accountNonce: nonce,
      currentBalance: controllerVotingBalance,
      extrinsic,
      fees: derivedBalanceFees,
      currentAccount: nominateWith
    }, api);

    return values.fold(
      (e: any) => left(e),
      (allExtrinsicData: any) => right(allExtrinsicData)
    );
  };

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.derive.balances.votingBalance(nominateWith) as Observable<DerivedBalances>),
      (api.query.system.accountNonce(nominateWith) as Observable<u64>)
    ])
      .pipe(take(1))
      .subscribe(([controllerVotingBalance, nonce]) => {
        setControllerVotingBalance(controllerVotingBalance);
        setNonce(nonce);
      });

    return () => subscription.unsubscribe();
  }, [nominateWith]);

  const [controllerVotingBalance, setControllerVotingBalance] = useState<DerivedBalances>();
  const [nonce, setNonce] = useState<u64>();
  const [status, setStatus] = useState<Either<Errors, AllExtrinsicData>>();

  useEffect(() => {
    setStatus(_validate());
  }, [derivedBalanceFees, nominateWith, nonce, onlyBondedAccounts]);

  useEffect(() => {
    errorObservable.subscribe(() => alert({ type: 'error', content: 'Uh oh, something went wrong. Please try again later or raise an issue.' }));
    successObservable.subscribe(() => history.push(`/manageAccounts/${nominateWith}/balances`));

    return () => {
      errorObservable.unsubscribe();
      successObservable.unsubscribe();
    };
  }, []);

  const onConfirm = () => {
    fromNullable(status)
      .map(_validate)
      .map(status =>
        status.fold(
          (errors) => { console.error(errors); /* should be displayed by Validation */ },
          (allExtrinsicData) => {
            const { extrinsic, amount, allFees, allTotal } = allExtrinsicData;
            const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(nominateWith) };
            enqueue(extrinsic, details);
          }
        )
      );
  };

  return (
    <React.Fragment>
      <Header>Confirm Details and Nominate!</Header>
      <Stacked><SubHeader>Nominate With: </SubHeader> <Address address={nominateWith}></Address></Stacked>
      <Margin top='huge' />
      <StackedHorizontal>
        <Card.Group centered>
          <Card>
            <Card.Content>
              <Stacked>
                <FadedText> Nominator </FadedText>
                <AddressSummary
                  address={nominateWith}
                  detailed
                  name={
                    fromNullable(keyring.getAccount(nominateWith.toString()))
                      .chain(account => some(account.meta))
                      .chain(meta => some(meta.name))
                      .getOrElse(undefined)
                  }
                  orientation='vertical'
                  size='small' />
              </Stacked>
            </Card.Content>
            <Card.Content extra>
              <SubHeader>Reward Destination: </SubHeader>
              {
                fromNullable(onlyBondedAccounts)
                  .mapNullable(onlyBondedAccounts => onlyBondedAccounts[nominateWith].rewardDestination)
                  .map(rewardDestinationIndex => rewardDestinationOptions[rewardDestinationIndex.toNumber()])
                  .getOrElse('Reward Destination Not Set...')
              }
            </Card.Content>
          </Card>
          <Margin left='huge' />
          <Stacked>
            <FadedText> Nominees </FadedText>
            <Card.Group centered>
              <div style={{ height: '25rem', overflow: 'auto' }}>
                {
                  nominees.map(nominee =>
                    <Card>
                      <Card.Content>
                        <AddressSummary
                          address={nominee.toString()}
                          name={
                            fromNullable(keyring.getAddress(nominee.toString()))
                              .chain(account => some(account.meta))
                              .chain(meta => some(meta.name))
                              .getOrElse(undefined)
                          }
                          noPlaceholderName
                          orientation='vertical'
                          size='small' />
                      </Card.Content>
                    </Card>
                  )
                }
              </div>
            </Card.Group>
          </Stacked>
        </Card.Group>
      </StackedHorizontal>
      <WithSpace>
        <Stacked>
          <StackedHorizontal>
            <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
            <Margin left />
            <StyledNavButton disabled={status && status.isLeft()} onClick={onConfirm}><Icon name='checkmark' color='green' /> Confirm </StyledNavButton>
          </StackedHorizontal>
          <Margin bottom />
          <StyledLinkButton onClick={() => handleSelectNominateWith(null)}>Change Account</StyledLinkButton>
        </Stacked>
      </WithSpace>
      {status && <Validation value={status} />}
    </React.Fragment>
  );
}
