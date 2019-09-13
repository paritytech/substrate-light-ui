// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { AddressSummary, Card, DynamicSizeText, FadedText, FlexItem, Margin, Menu, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, Transition, WithSpaceAround } from '@substrate/ui-components';
import React, { useState, useEffect } from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { Create } from '../AddAccount/Create';
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

  const renderMessage = () => {
    return (
      <FlexItem flex={2}>
        <WithSpaceAround>
          <FadedText>
            <DynamicSizeText fontSize='large'>
              {
                whichAccount === 'stash'
                  ? 'Your Stash Account(s) will hold the majority of your funds so it should ideally remain disconnected from the network, and only used to bond funds to your controller.'
                  : 'Your Controller Account will be for day to day needs, such as paying tx fees, and nominating new validators.'
              }
              </DynamicSizeText>
          </FadedText>
          {
            (
              ((whichAccount === 'stash' && keyringAccounts.length > 0)
                || (whichAccount === 'controller' && keyringAccounts.length > 1))
                && (
                  <Stacked justifyContent='space-around'>
                    <SubHeader>We found the following account(s) in your local Keyring: </SubHeader>
                    <StackedHorizontal alignItems='stretch'>
                      {
                        keyringAccounts.map((account: CreateResult) => <WithSpaceAround margin='small' padding='small'><AddressSummary address={account.json.address} name={account.json.meta.name} size='tiny' /></WithSpaceAround>)
                      }
                    </StackedHorizontal>
                    <Margin top />
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
    const activeTab = location.pathname.split('/')[2];

    return (
      <Transition animation={'scale'} duration={1000} transitionOnMount={true}>
        <FlexItem flex={3}>
          <WithSpaceAround>
            <Card style={{ height: '100%' }}>
              <Card.Header>
                <Menu>
                  <Menu.Item active={activeTab === 'Restore' } onClick={() => history.push(`${path}/restore`)}>Restore</Menu.Item>
                  <Menu.Item active={activeTab === 'Create' } onClick={() => history.push(`${path}/create`)}>Create</Menu.Item>
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
