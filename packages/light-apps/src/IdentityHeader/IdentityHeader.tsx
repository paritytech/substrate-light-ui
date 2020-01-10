// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Accordion, Balance, CopyButton, Icon, InputAddress, Margin, Menu } from '@substrate/ui-components';
import React, { useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>;

export function IdentityHeader(props: Props): React.ReactElement {
  const {
    history,
    location,
    match: {
      params: { currentAccount },
    },
  } = props;

  const [expandHeader, setExpandHeader] = useState(false);

  const currentPath = location.pathname.split('/')[1];

  const handleExpandHeader = (): void => {
    setExpandHeader(!expandHeader);
  };

  // Change account
  const changeCurrentAccount = (account: string): void => {
    history.push(`/${currentPath}/${account}`);
  };

  const renderPrimaryMenu = (): React.ReactElement => {
    const activeTab = location.pathname.split('/')[1];

    const navToAccounts = (): void => {
      history.push(`/manageAccounts/${currentAccount}`);
    };

    const navToAddAccount = (): void => {
      history.push(`/accounts/${currentAccount}/add/generate`);
    };

    const navToManageAddressBook = (): void => {
      history.push(`/addresses/${currentAccount}`);
    };

    const navToAddAddress = (): void => {
      history.push(`/addresses/${currentAccount}/add`);
    };

    return (
      <Menu stackable widths={6}>
        <Switch>
          <Route path={['/manageAccounts', '/addresses', '/accounts/:currentAccount', '/transfer']}>
            <Menu.Item>
              <InputAddress fluid onChangeAddress={changeCurrentAccount} value={currentAccount} />
              <CopyButton value={currentAccount} />
            </Menu.Item>
            <Menu.Item>
              <Balance address={currentAccount} fontSize='medium' />
            </Menu.Item>
            <Accordion>
              <Accordion.Title onClick={handleExpandHeader}>Options</Accordion.Title>
              <Accordion.Content active={expandHeader}>
                <Menu.Item active={activeTab === 'manageAccounts'} onClick={navToAccounts}>
                  Accounts
                  <Margin left='small' />
                  <Icon color='black' name='id card' />
                </Menu.Item>
                <Menu.Item active={activeTab === 'accounts'} onClick={navToAddAccount}>
                  Add an Account <Icon name='plus' />
                </Menu.Item>
                <Menu.Item
                  active={activeTab === 'addresses' && !location.pathname.split('/')[3]}
                  onClick={navToManageAddressBook}
                >
                  Address Book
                  <Margin left='small' />
                  <Icon color='black' name='id card' />
                </Menu.Item>
                <Menu.Item
                  active={activeTab === 'addresses' && location.pathname.split('/')[3] === 'add'}
                  onClick={navToAddAddress}
                >
                  Add an Address <Icon name='plus' />
                </Menu.Item>
              </Accordion.Content>
            </Accordion>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const renderHeader = (): React.ReactElement => renderPrimaryMenu();

  return renderHeader();
}
