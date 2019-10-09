// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, CopyButton, Dropdown, FadedText, Icon, InputAddress, Margin, Menu, NavLink, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';
import Joyride from 'react-joyride';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Backup } from './Backup';
import { Forget } from './Forget';
import { Rename } from './Rename';
import { tutorialSteps } from '../constants';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function IdentityHeader (props: Props) {
  const { history, location, match: { params: { currentAccount } } } = props;

  const currentPath = location.pathname.split('/')[1];

  // Change account
  const changeCurrentAccount = (account: string) => {
    history.push(`/${currentPath}/${account}`);
  };

  const renderPrimaryMenu = () => {
    return (
      <Menu stackable>
        <Switch>
          <Route path={['/governance', '/manageAccounts', '/transfer']}>
            <Menu.Item fitted>
              <StackedHorizontal>
                <InputAddress
                  fluid
                  onChangeAddress={changeCurrentAccount}
                  value={currentAccount}
                />
                <CopyButton value={currentAccount} />
              </StackedHorizontal>
            </Menu.Item>
            <Menu.Item><Balance address={currentAccount} fontSize='medium' /></Menu.Item>
            <Menu.Item>
              <NavLink to={`/accounts/${currentAccount}/add`} className='.add-account'>
                Add an Account <Icon name='plus' />
              </NavLink>
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
          <Route path='/addresses'>
            <Menu.Item><FadedText>Manage Address Book</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Inspect the status of any identity and name it for later use</SubHeader></Menu.Item>
          </Route>
          <Route path='/accounts/:currentAccount/add'>
            <Menu.Item><FadedText>Add Account</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Create a new account from a generated mnemonic seed, or import via your JSON backup file/mnemonic phrase. </SubHeader></Menu.Item>
          </Route>
          <Route path='/manageAccounts/:currentAccount'>
            <Menu.Item><FadedText>Manage Accounts</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Manage Your Accounts, including Staking, Bonding, Nominating </SubHeader></Menu.Item>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const renderSecondaryMenu = () => {
    const navToAccounts = () => {
      history.push(`/manageAccounts/${currentAccount}`);
    };

    const navToGovernance = () => {
      history.push(`/governance/${currentAccount}`);
    };

    const navToManageAddressBook = () => {
      history.push(`/addresses/${currentAccount}`);
    };

    const navToTransfer = () => {
      history.push(`/transfer/${currentAccount}`);
    };

    return (
      <StackedHorizontal justifyContent='flex-start' alignItems='flex-start'>
        <Menu stackable secondary>
          <Menu.Item onClick={navToAccounts} className='.accounts-overview'>
            Accounts
            <Margin left='small' />
            <Icon color='black' name='id card' />
          </Menu.Item>
          <Menu.Item onClick={navToGovernance}>
            Governance
            <Margin left='small' />
            <Icon color='black' name='hand paper outline' />
          </Menu.Item>
          <Menu.Item onClick={navToTransfer}>
            Transfer Balance
            <Margin left='small' />
            <Icon color='black' name='send' />
          </Menu.Item>
          <Menu.Item onClick={navToManageAddressBook}>
            Manage Address Book
            <Margin left='small' />
            <Icon color='black' name='address book' />
          </Menu.Item>
        </Menu>
      </StackedHorizontal>
    );
  };

  const renderHeader = () => (
    <React.Fragment>
      <Joyride run={true} steps={tutorialSteps} />
      <Margin top='big' />
      {renderSecondaryMenu()}
      {renderPrimaryMenu()}
    </React.Fragment>
  );

  return renderHeader();
}
