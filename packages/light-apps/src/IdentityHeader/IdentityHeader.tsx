// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import uiSettings from '@polkadot/ui-settings';
import { AlertsContext } from '@substrate/ui-common';
import { Balance, CopyButton, Dropdown, DropdownProps, FadedText, Icon, Margin, Menu, NavLink, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Backup } from './Backup';
import { Forget } from './Forget';
import { InputAddress } from './IdentityHeader.styles';
import { Rename } from './Rename';

const KEY_PREFIX = '__dropdown_option_';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const nodeOptions: Array<any> = [];

uiSettings.availableNodes.forEach(availNode => {
  nodeOptions.push({
    key: `${KEY_PREFIX}${availNode.value}`,
    value: availNode.value,
    text: availNode.text
  });
});

const isValidUrl = (apiUrl: string): boolean => {
  return (
    (apiUrl.length > 5) &&
    // check that it starts with a valid ws identifier
    (apiUrl.startsWith('ws://') || apiUrl.startsWith('wss://'))
  );
};

const urlChanged = (selectedUrl: string): boolean => {
  return uiSettings.get().apiUrl !== selectedUrl;
};

export function IdentityHeader (props: Props) {
  const { history, location, match: { params: { currentAccount } } } = props;
  const { enqueue } = useContext(AlertsContext);

  const currentPath = location.pathname.split('/')[1];

  // Change account
  const changeCurrentAccount = (account: string) => {
    if (currentPath === 'governance') {
      history.push(`/governance/${account}`);
    } else if (currentPath === 'transfer') {
      history.push(`/transfer/${account}`);
    }
  };

  const renderPrimaryMenu = () => {
    return (
      <Menu stackable>
        <Switch>
          <Route path={['/governance', '/manageAccounts', '/transfer']}>
            <Menu.Item fitted>
              <StackedHorizontal>
                <InputAddress
                  label={null}
                  onChange={changeCurrentAccount}
                  type='account'
                  value={currentAccount}
                  withLabel={false}
                />
                <CopyButton value={currentAccount} />
              </StackedHorizontal>
            </Menu.Item>
            <Menu.Item><Balance address={currentAccount} detailed={false} fontSize='medium' /></Menu.Item>
            <Menu.Item>
              <NavLink to={`/accounts/${currentAccount}/add`}>
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
          <Route path='/manageAccounts'>
            <Menu.Item><FadedText>Manage Accounts</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Manage Your Accounts, including Staking, Bonding, Nominating </SubHeader></Menu.Item>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const onSelectNode = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const wsUrl = data.value as string;

    if (isValidUrl(wsUrl) && urlChanged(wsUrl)) {
      uiSettings.set({ apiUrl: wsUrl });

      window.location.reload();
    } else {
      enqueue({
        content: 'The Websocket endpoint you selected is invalid.',
        type: 'error'
      });
    }
  };

  const renderSecondaryMenu = () => {
    const navToAccounts = () => {
      history.push(`/manageAccounts`);
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
          <Menu.Item onClick={navToAccounts}>
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
          <Dropdown icon='setting' item onChange={onSelectNode} options={nodeOptions} position='right' pointing selection text='Select a Node' />
        </Menu>
      </StackedHorizontal>
    );
  };

  const renderHeader = () => (
    <React.Fragment>
      <Margin top='big' />
      {renderSecondaryMenu()}
      {renderPrimaryMenu()}
    </React.Fragment>
  );

  return renderHeader();
}
