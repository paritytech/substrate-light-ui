// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  Balance,
  CopyButton,
  Dropdown,
  FadedText,
  Icon,
  InputAddress,
  Margin,
  Menu,
  SubHeader,
} from '@substrate/ui-components';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Backup } from './Backup';
import { Forget } from './Forget';
import { Rename } from './Rename';

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

  const currentPath = location.pathname.split('/')[1];

  // Change account
  const changeCurrentAccount = (account: string): void => {
    history.push(`/${currentPath}/${account}`);
  };

  const renderPrimaryMenu = (): React.ReactElement => {
    const activeTab = location.pathname.split('/')[1];

    const navToAccounts = (): void => {
      history.push(`/manageAccounts/${currentAccount}`);
    };

    const navToManageAddressBook = (): void => {
      history.push(`/addresses/${currentAccount}`);
    };

    return (
      <Menu stackable widths={5} fitted>
        <Switch>
          <Route path={['/manageAccounts', '/addresses']}>
            <Menu.Item>
              <InputAddress fluid onChangeAddress={changeCurrentAccount} value={currentAccount} />
              <CopyButton value={currentAccount} />
            </Menu.Item>
            <Menu.Item>
              <Balance address={currentAccount} fontSize='medium' />
            </Menu.Item>
            <Menu.Item>
              <Link to={`/accounts/${currentAccount}/add`}>
                Add an Account <Icon name='plus' />
              </Link>
            </Menu.Item>
            <Menu.Item active={activeTab === 'addresses'} onClick={navToManageAddressBook}>
              Address Book
              <Margin left='small' />
              <Icon color='black' name='id card' />
            </Menu.Item>
            <Menu.Item active={activeTab === 'manageAccounts'} onClick={navToAccounts}>
              Accounts
              <Margin left='small' />
              <Icon color='black' name='id card' />
            </Menu.Item>
            <Menu.Menu position='right'>
              <Dropdown
                icon='setting'
                position='right'
                item
                pointing
                text='Manage Account &nbsp;' /* TODO add margin to the icon instead */
              >
                <Dropdown.Menu>
                  <Rename currentAccount={currentAccount} />
                  <Backup currentAccount={currentAccount} />
                  <Forget currentAccount={currentAccount} history={history} />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Route>
          <Route path='/accounts/:currentAccount/add'>
            <Menu.Item>
              <FadedText>Add Account</FadedText>
            </Menu.Item>
            <Menu.Item>
              <SubHeader>
                Create a new account from a generated mnemonic seed, or import via your JSON backup file/mnemonic
                phrase.{' '}
              </SubHeader>
            </Menu.Item>
          </Route>
          <Route path='/manageAccounts/:currentAccount'>
            <Menu.Item>
              <FadedText>Manage Accounts</FadedText>
            </Menu.Item>
            <Menu.Item>
              <SubHeader>Manage Your Accounts, including Staking, Bonding, Nominating </SubHeader>
            </Menu.Item>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const renderHeader = (): React.ReactElement => renderPrimaryMenu();

  return renderHeader();
}
