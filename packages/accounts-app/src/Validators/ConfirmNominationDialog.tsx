// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
Show a list of current validators with ability to sort by times reported offline.

Explain that validators get slashed when they misbehave. Misbehaving is characterized by:
1. Reported offline
2. Running malicious code

on confirm, redirect to the detailed balances page, which should now show the stash and controllers as "linked" with the correct bond, plus nominating the correct validator

should someone who goes to the staking tab from a stash already bonded, they should be directed straight to validator selection tab. You can nominate multiple validators from the same stash/controller pair
*/

import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, Balance, Index } from '@polkadot/types';
import { AppContext, StakingContext, TxQueueContext, validateDerived, AlertsContext } from '@substrate/ui-common';
import { Address, AddressSummary, FadedText, Header, Icon, Margin, Stacked, StackedHorizontal, StyledLinkButton, StyledNavButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import H from 'history';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Observable, Subscription, combineLatest } from 'rxjs';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

interface Props {
  history: H.History;
  nominatee: string;
}

export const rewardDestinationOptions = ['Send rewards to my Stash account and immediately use it to stake more.', 'Send rewards to my Stash account but do not stake any more.', 'Send rewards to my Controller account.'];

// TODO: p3 refactor all this to smaller components
export function ConfirmNominationDialog (props: Props) {
  const { nominatee } = props;
  const { enqueue: alert } = useContext(AlertsContext);
  const { api, keyring } = useContext(AppContext);
  const { onlyBondedAccounts } = useContext(StakingContext);
  const { enqueue } = useContext(TxQueueContext);
  const [loading, setLoading] = useState(false);
  const [nominateWith, setNominateWith] = useState();

  const [controllerReservedBalance, setControllerReservedBalance] = useState();
  const [controllerVotingBalance, setControllerVotingBalance] = useState<DerivedBalances>();
  const [fees, setFees] = useState<DerivedFees>();
  const [nonce, setNonce] = useState<Index>();

  useEffect(() => {
    if (!nominateWith) { return; }

    const subscription: Subscription = combineLatest([
      (api.query.balances.reservedBalance(nominateWith) as Observable<Balance>),
      (api.derive.balances.votingBalance(nominateWith) as Observable<DerivedBalances>),
      (api.derive.balances.fees() as Observable<DerivedFees>),
      (api.query.system.accountNonce(nominateWith) as Observable<Index>)
    ])
    .subscribe(([controllerReservedBalance, controllerVotingBalance, fees, nonce]) => {
      setControllerReservedBalance(controllerReservedBalance);
      setControllerVotingBalance(controllerVotingBalance);
      setFees(fees);
      setNonce(nonce);
    });

    return () => subscription.unsubscribe();
  }, [nominateWith]);

  const handleAccountSelected = ({ currentTarget: { dataset: { account } } }: React.MouseEvent<HTMLElement>) => {
    setNominateWith(account);
  };

  const onConfirm = () => {
    if (!nonce || !controllerVotingBalance || !fees) { return; }

    const extrinsic = api.tx.staking.nominate(nominatee);

    // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
    const values = validateDerived({
      accountNonce: nonce,
      amount: new Balance(controllerReservedBalance), // the bonded value of the Controller gets assigned to participate in the network security.
      currentBalance: controllerReservedBalance,
      extrinsic,
      fees
    });

    values.fold(
      (errors: any) => {
        alert({ type: 'error', content: Object.values(errors) });
      },
      (allExtrinsicData: any) => {
        const { extrinsic, amount, allFees, allTotal, recipientAddress: nominatee } = allExtrinsicData;
        const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(nominateWith), recipientAddress: nominatee };
        enqueue(extrinsic, details);
        setLoading(false);
      }
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
                        .getOrElse([].map(renderNoBondedAccounts))
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
    if (loading) {
      return <Loader active inline />;
    } else {
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
          <Card>
            <Card.Content>
              <Stacked>
                <FadedText> Validator </FadedText>
                <AddressSummary
                  address={nominatee}
                  detailed
                  name={
                    fromNullable(keyring.getAddress(nominatee.toString()))
                      .chain(account => some(account.meta))
                      .chain(meta => some(meta.name))
                      .getOrElse(undefined)
                  }
                  orientation='vertical'
                  size='small' />
              </Stacked>
            </Card.Content>
          </Card>
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
    }
  };

  const renderNoBondedAccounts = () => {
    const navToStakingOptions = () => {
      const currentAccount = location.pathname.split('/')[2];
      props.history.push(`/accountManagement/${currentAccount}/staking/setup`);
    };

    return (
      <React.Fragment>
        No bonded accounts in your keyring.
        <Margin top='large' />
        <StyledNavButton onClick={navToStakingOptions}>Bond</StyledNavButton>
      </React.Fragment>
    );
  };

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      trigger={<StyledNavButton> Nominate </StyledNavButton>}
    >
      <WithSpaceAround>
        {
          nominateWith
            ? renderConfirmDetails()
            : renderChooseAccount()
        }
      </WithSpaceAround>
    </Modal>
  );
}
