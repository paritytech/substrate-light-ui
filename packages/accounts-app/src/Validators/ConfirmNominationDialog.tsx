// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, Index } from '@polkadot/types';
import { AllExtrinsicData, AppContext, StakingContext, TxQueueContext, validate } from '@substrate/ui-common';
import { Address, AddressSummary, FadedText, Header, Icon, Margin, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import BN from 'bn.js';
import H from 'history';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { Errors } from '../types';
import { Validation } from '../Validation';

interface Props {
  disabled?: boolean;
  history: H.History;
  nominees: string[];
}

export const rewardDestinationOptions = ['Send rewards to my Stash account and immediately use it to stake more.', 'Send rewards to my Stash account but do not stake any more.', 'Send rewards to my Controller account.'];

// TODO: p3 refactor all this to smaller components
export function ConfirmNominationDialog (props: Props) {
  const { disabled, history, nominees } = props;
  const { api, keyring } = useContext(AppContext);
  const { derivedBalanceFees, onlyBondedAccounts } = useContext(StakingContext);
  const { enqueue, successObservable } = useContext(TxQueueContext);

  const [nominateWith, setNominateWith] = useState();
  const [controllerVotingBalance, setControllerVotingBalance] = useState<DerivedBalances>();
  const [nonce, setNonce] = useState<Index>();
  const [status, setStatus] = useState<Either<Errors, AllExtrinsicData>>();

  useEffect(() => {
    if (!nominateWith || !nominees) { return; }

    const subscription: Subscription = combineLatest([
      (api.derive.balances.votingBalance(nominateWith) as Observable<DerivedBalances>),
      (api.query.system.accountNonce(nominateWith) as Observable<Index>)
    ])
    .pipe(take(1))
    .subscribe(([controllerVotingBalance, validatorBalance]) => {
      setControllerVotingBalance(controllerVotingBalance);
      setNonce(nonce);
    });

    return () => subscription.unsubscribe();
  }, [nominateWith]);

  useEffect(() => {
    if (!nominateWith) { return; }
    setStatus(_validate());
  }, [derivedBalanceFees, nominateWith, nonce, onlyBondedAccounts]);

  useEffect(() => {
    successObservable.subscribe(success => history.push(`/manageAccounts/${nominateWith}/balances`));

    return () => successObservable.unsubscribe();
  }, []);

  const _validate = (): Either<Errors, AllExtrinsicData> => {
    let errors: Errors = [];

    if (!nonce) { errors.push('Calculating account nonce...'); }

    const stakingLedger = onlyBondedAccounts[nominateWith].stakingLedger;
    const nominationAmount = stakingLedger && stakingLedger.total;

    if (!stakingLedger) { errors.push('Staking ledger is undefined... Please refresh and try again or try with a different account.'); }
    if (!nominationAmount || nominationAmount.lte(new BN(0))) { errors.push('Nomination amount must be greater than zero.'); }

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

  const handleAccountSelected = ({ currentTarget: { dataset: { account } } }: React.MouseEvent<HTMLElement>) => {
    setNominateWith(account);
  };

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

  // TODO for now only show controllers, later add ability to restore and unlock controller from stash in keyring
  const renderBondedAccountOption = (account: AccountId | string) => {
    // TODO: p2 put this logic somewhere elsea so it's reusable
    const stakingInfo = onlyBondedAccounts[account.toString()];
    const accountType = stakingInfo.accountId === stakingInfo.controllerId ? 'controller' : 'stash';
    const bondingPair = accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId;

    return (
      <WithSpace key={account.toString()}>
        <Card>
          <Card.Content onClick={handleAccountSelected} data-account={account.toString()}>
            <AddressSummary
              address={account.toString()}
              bondingPair={bondingPair && bondingPair.toString()}
              detailed
              name={
                fromNullable(keyring.getAccount(account.toString()))
                  .chain(account => some(account.meta))
                  .chain(meta => some(meta.name))
                  .getOrElse(undefined)}
              orientation='vertical'
              size='small'
              type={accountType}
            />
          </Card.Content>
          {
            bondingPair
              && (
                <Card.Content extra>
                  <StackedHorizontal>
                    <FadedText>Stash:</FadedText>
                    <Address address={bondingPair.toString()} shortened zIndex={100000} />
                  </StackedHorizontal>
                </Card.Content>
              )
          }
        </Card>
      </WithSpace>
    );
  };

  const renderChooseAccount = () => {
    return (
      <React.Fragment>
        <Header>Select the Account You Wish to Nominate With:</Header>
        <Modal.Actions>
          <Stacked>
            <StackedHorizontal justifyContent='flex-start' alignItems='flex-start'>
              <WithSpace>
                <Stacked>
                  <SubHeader>Bonded Accounts</SubHeader>
                  <Card.Group>
                    {
                      fromNullable(onlyBondedAccounts)
                        .map(bonded => Object.keys(bonded))
                        .map(accounts => accounts.filter((account) => {
                          // TODO for now only show controllers, later add ability to restore and unlock controller from stash in keyring
                          const stakingInfo = onlyBondedAccounts[account.toString()];
                          const accountType = stakingInfo.accountId === stakingInfo.controllerId ? 'controller' : 'stash';
                          return accountType === 'controller';
                        }))
                        .map(accounts => accounts.map(renderBondedAccountOption))
                        .getOrElse([1].map(renderNoBondedAccounts))
                    }
                  </Card.Group>
                </Stacked>
              </WithSpace>
            </StackedHorizontal>
            <FadedText>If you don't see an account listed here, you should make sure it is bonded before you can nominate with it.</FadedText>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  };

  const renderConfirmDetails = () => {
    return (
    <React.Fragment>
      <Header>Confirm Details and Nominate!</Header>
      <Stacked><SubHeader>Nominate With: </SubHeader> <Address address={nominateWith}></Address></Stacked>
      <Margin top='huge' />
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
                  .mapNullable(onlyBondedAccounts => [onlyBondedAccounts, nominateWith])
                  .map(([onlyBondedAccounts, nominateWith]) => rewardDestinationOptions[onlyBondedAccounts[nominateWith].rewardDestination.toNumber()])
                  .getOrElse('Reward Destination Not Set...')
              }
          </Card.Content>
        </Card>
        <Margin left />
            <Stacked>
              <FadedText> Nominees </FadedText>
              <Card.Group>
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
              </Card.Group>
            </Stacked>
      </Card.Group>
      <WithSpace>
        <Stacked>
          <StackedHorizontal>
            <StyledLinkButton onClick={close}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
            <Margin left />
            <StyledNavButton onClick={onConfirm}><Icon name='checkmark' color='green' /> Confirm </StyledNavButton>
          </StackedHorizontal>
          <Margin bottom />
          <StyledLinkButton onClick={() => setNominateWith(undefined)}>Change Account</StyledLinkButton>
        </Stacked>
      </WithSpace>
    </React.Fragment>
    );
  };

  const renderNoBondedAccounts = () => {
    const navToStakingOptions = () => {
      const currentAccount = location.pathname.split('/')[2];
      props.history.push(`/accountManagement/${currentAccount}/staking/setup`);
    };

    return (
      <React.Fragment>
        <Header>No bonded accounts in your keyring.</Header>
        <Margin top='large' />
        <StyledNavButton onClick={navToStakingOptions}>Bond</StyledNavButton>
      </React.Fragment>
    );
  };

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      trigger={<StyledNavButton disabled={disabled}> Nominate </StyledNavButton>}
    >
      <WithSpaceAround>
        {
          nominateWith
            ? renderConfirmDetails()
            : renderChooseAccount()
        }
        { status && <Validation value={status} /> }
      </WithSpaceAround>
    </Modal>
  );
}
