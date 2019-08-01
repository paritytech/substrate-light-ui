// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { AppContext, StakingContext } from '@substrate/ui-common';
import { Address, AddressSummary, FadedText, Header, Margin, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, WithSpace } from '@substrate/ui-components';
import { fromNullable, some } from 'fp-ts/lib/Option';
import H from 'history';
import React, { useContext } from 'react';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

interface Props {
  history: H.History;
  handleSelectNominateWith: (account: string | null) => void;
}

export function SelectNominateWith (props: Props) {
  const { history, handleSelectNominateWith } = props;
  const { keyring } = useContext(AppContext);
  const { onlyBondedAccounts } = useContext(StakingContext);

  const handleAccountSelected = ({ currentTarget: { dataset: { account } } }: React.MouseEvent<HTMLElement>) => {
    handleSelectNominateWith(account!);
  };

  const renderNoBondedAccounts = () => {
    const navToStakingOptions = () => {
      const currentAccount = location.pathname.split('/')[2];
      history.push(`/accountManagement/${currentAccount}/staking/setup`);
    };

    return (
      <React.Fragment>
        <Header>No bonded accounts in your keyring.</Header>
        <Margin top='large' />
        <StyledNavButton onClick={navToStakingOptions}>Bond</StyledNavButton>
      </React.Fragment>
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
}
