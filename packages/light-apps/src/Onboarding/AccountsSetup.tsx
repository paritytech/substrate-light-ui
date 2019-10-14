// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { AddressSummary, Card, DynamicSizeText, FadedText, FlexItem, Menu, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, Transition, WithSpaceAround } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useState, useEffect } from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { Create } from '../AddAccount/Create/CreateAccount';
import { Restore } from '../AddAccount/Restore';

interface Props extends RouteComponentProps { }

export function AccountsSetup (props: Props) {
  const { history, location } = props;
  const [keyringAccounts, setKeyringAccounts] = useState();
  const [whichAccount, setWhichAccount] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      setKeyringAccounts(values);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  useEffect(() => {
    const whichAccount = location.pathname.split('/')[2];

    setWhichAccount(whichAccount.toLowerCase());
  }, [location]);

  const navToClaim = () => {
    history.push('/onboarding/claim');
  };

  const navToCreateController = () => {
    history.push('/onboarding/controller');
  };

  const isReadyForNextStep = (): boolean => {
    return ((whichAccount === 'stash' && keyringAccounts.length > 0) || (whichAccount === 'controller' && keyringAccounts.length > 1));
  };

  const renderMessage = () => {
    return (
      <FlexItem flex={2}>
        <WithSpaceAround>
          <FadedText>
            <DynamicSizeText fontSize='medium'>
              {
                whichAccount === 'stash'
                  ? (
                    <React.Fragment>
                      Your Stash Account(s) will hold the majority of your funds.
                      <br />
                      <br />
                      We highly encourage you to keep its private key disconnected from any network, and only use it to bond funds to your Controller Account(s).
                    </React.Fragment>
                  )
                  : 'Your Controller Account will be for day to day needs, such as paying tx fees, and nominating new validators.'
              }
              </DynamicSizeText>
          </FadedText>
          {
            (
              isReadyForNextStep()
                && (
                  <WithSpaceAround>
                    <Stacked justifyContent='space-around'>
                      <StyledNavButton
                        onClick={ whichAccount === 'stash'
                              ? () => navToCreateController()
                              : () => navToClaim()
                        }>
                          {
                            whichAccount === 'stash'
                              ? 'Create Controller'
                              : 'Claim KSM'
                          }
                      </StyledNavButton>
                    </Stacked>
                  </WithSpaceAround>
                )
            )
          }
        </WithSpaceAround>
      </FlexItem>
    );
  };

  const renderSetupCard = () => {
    const { location } = props;
    const path = location.pathname.split('/').slice(0, 3).join('/');
    const activeTab = location.pathname.split('/')[3];

    const renderAffirmation = () => {
      const isStash = location.pathname.split('/')[2] === 'stash'; // yuck

      if (isStash) {
        return (
          <Stacked>
            <SubHeader> Good Job! </SubHeader>
            <FadedText>You've created your first Stash account.</FadedText>
            <WithSpaceAround>
            {
              keyringAccounts.filter((account: CreateResult) => {
                return fromNullable(account.json.meta.tags)
                  .map(tags => tags.map((tag: string) => tag.toLowerCase()))
                  .map(lowercaseTags => lowercaseTags.includes('stash'))
                  .getOrElse(undefined);
              }).map((account: CreateResult) =>
                <AddressSummary address={account.json.address} name={account.json.meta.name} size='small' />
              )
            }
            </WithSpaceAround>
          </Stacked>
        );
      } else {
        return (
          <React.Fragment>
            <SubHeader> Nice! </SubHeader>
            <FadedText> Now that you have your minimum accounts set up, you can go ahead and claim your tokens, or skip to bonding. </FadedText>
            <StackedHorizontal>
              <Stacked>
                <SubHeader>Stash:</SubHeader>
                {
                  keyringAccounts.filter((account: CreateResult) => account.json.meta.tags && account.json.meta.tags.includes('stash'))
                                  .map((account: CreateResult) =>
                                    <AddressSummary address={account.json.address} name={account.json.meta.name} size='small' />
                                  )
                }
              </Stacked>

              <Stacked>
                <SubHeader>Controller:</SubHeader>
                {
                  keyringAccounts.filter((account: CreateResult) => account.json.meta.tags && account.json.meta.tags.includes('controller'))
                                  .map((account: CreateResult) =>
                                    <AddressSummary address={account.json.address} name={account.json.meta.name} size='small' />
                                  )
                }
              </Stacked>
            </StackedHorizontal>
          </React.Fragment>
        );
      }
    };

    return (
      <Transition animation={'scale'} duration={1000} mountOnShow>
        {
          isReadyForNextStep()
            ? (
              <FlexItem flex={2}>
                {renderAffirmation()}
              </FlexItem>
            )
            : (
              <FlexItem flex={3}>
                <WithSpaceAround>
                  <Card style={{ height: '100%' }}>
                    <Card.Header>
                      <Menu fluid secondary widths={2}>
                        <Menu.Item active={activeTab === 'create'} onClick={() => history.push(`${path}/create`)}>Create</Menu.Item>
                        <Menu.Item active={activeTab === 'restore'} onClick={() => history.push(`${path}/restore`)}>Restore</Menu.Item>
                      </Menu>
                    </Card.Header>
                    <Card.Content>
                      <Switch>
                        <Route path='/onboarding/stash/create' render={(props: Props) => <Create identiconSize='small' {...props} />} />
                        <Route path='/onboarding/controller/create' render={(props: Props) => <Create identiconSize='small' {...props} />} />
                        <Route path='/onboarding/stash/restore' render={(props: Props) => <Restore {...props} />} />
                        <Route path='/onboarding/controller/restore' render={(props: Props) => <Restore {...props}/>} />
                        <Redirect exact path='/onboarding/stash' to='/onboarding/stash/create' />
                        <Redirect exact path='/onboarding/controller' to='/onboarding/controller/create' />
                      </Switch>
                    </Card.Content>
                  </Card>
                </WithSpaceAround>
              </FlexItem>
            )
        }
      </Transition>
    );
  };

  return (
    <Modal.Content>
      <StackedHorizontal>
        { renderSetupCard() }
        { renderMessage() }
      </StackedHorizontal>
    </Modal.Content>
  );
}
