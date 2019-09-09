// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Card, DynamicSizeText, FadedText, Grid, Menu, Modal, StackedHorizontal, StyledNavButton, StyledLinkButton, Transition, WrapperDiv } from '@substrate/ui-components';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { Create } from '../AddAccount/Create';
import { Restore } from '../AddAccount/Restore';

interface Props extends RouteComponentProps { }

export function AccountsSetup (props: Props) {
  const { history, location } = props;
  const [activeTab, setActive] = useState('Create');
  const [isKeyringEmpty, setIsKeyringEmpty] = useState(true);
  const [whichAccount, setWhichAccount] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      if (values.length > 0) {
        setIsKeyringEmpty(false);
      }
    });

    const whichAccount = location.pathname.split('/')[2];
    setWhichAccount(whichAccount.toUpperCase());

    return () => accountsSub.unsubscribe();
  }, [location]);

  const navToClaim = () => {
    history.push('/onboarding/claim');
  };

  const navToCreateController = () => {
    history.push('/onboarding/controller');
  };

  const setActiveTab = ({ currentTarget: { dataset: { active } } }: React.MouseEvent<HTMLElement>) => {
    setActive(active || '');
  };

  return (
    <React.Fragment>
      <Modal.Content>
        <Grid>
          <Grid.Row>
            { renderSetupCard(props, activeTab, setActiveTab) }
            { renderMessage(whichAccount) }
          </Grid.Row>
        </Grid>
      </Modal.Content>
        <WrapperDiv width='85%'>
          <StackedHorizontal justifyContent='space-between'>
            <StyledLinkButton onClick={() => history.goBack()} >Back</StyledLinkButton>
            {
              <StyledNavButton disabled={isKeyringEmpty}
                onClick={
                  whichAccount === 'STASH'
                    ? navToCreateController
                    : navToClaim
                }> Next </StyledNavButton>
            }
          </StackedHorizontal>
        </WrapperDiv>
      </React.Fragment>
  );
}

function renderMessage (whichAccount: string) {
  return (
    <Grid.Column width='8'>
      <FadedText>
        <DynamicSizeText fontSize='large'>
          {
            whichAccount === 'STASH'
              ? 'You should use your Stash Account as a cold store for the majority of your funds.'
              : 'Your Controller Account will be for your day to day usage, like paying tx fees, and nominating new validators.'
          }
          </DynamicSizeText>
      </FadedText>
    </Grid.Column>
  );
}

function renderSetupCard (historyProps: RouteComponentProps, activeTab: string, setActiveTab: (something: any) => void) {
  return (
    <Transition.Group animation={'browse'} duration={1000}>
      <Grid.Column width='8'>
        <Card height='100%'>
          <Card.Header>
            <Menu>
              <Menu.Item active={activeTab === 'Restore' } data-active={'Restore'} onClick={setActiveTab}>Restore</Menu.Item>
              <Menu.Item active={activeTab === 'Create' } data-active={'Create'} onClick={setActiveTab}>Create</Menu.Item>
            </Menu>
          </Card.Header>
          <Card.Content>
            { activeTab === 'Restore' ? <Restore {...historyProps} /> : <Create {...historyProps} /> }
          </Card.Content>
        </Card>
      </Grid.Column>
    </Transition.Group>
  );
}
