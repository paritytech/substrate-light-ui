// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Container, Header, Layout, NavButton } from '../src';
import { withTheme } from './customDecorators';
import { FabStory } from './Fab.stories';
import { InputTransferFundsStory } from './Input.stories';
import { MenuTabsStory } from './Menu.stories';
import {
  ModalEnterJsonStory,
  ModalEnterMnemonicStory,
  ModalNewMnemonicStory,
  ModalRewriteMnemonicStory,
} from './Modal.stories';
import { TableAccountsStory } from './TableAccounts.stories';
import { TableTxSummaryStory } from './TableTxSummary.stories';
import { TopBarStory } from './TopBar.stories';

export const withAppMenuAccounts = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <>
      <MenuTabsStory />
      <TopBarStory />
      <FabStory />
      <Container className='flex-column items-start'>{storyFn()}</Container>
    </>
  );
};
export const withAppMenuSend = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <>
      <MenuTabsStory activeItem='Send Funds' />
      <TopBarStory />
      <Container className='flex-column items-start'>{storyFn()}</Container>
    </>
  );
};

// TODO:
storiesOf('Apps/Lichen', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withAppMenuAccounts)
  .add('1 – Loading', () => <></>);

storiesOf('Apps/Lichen/2 – Accounts', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withAppMenuAccounts)
  .add('2.0 – Accounts (Empty)', () => (
    <>
      <Layout>
        <Header className='inline-flex mr3 mb0'>Your Accounts </Header>
        <ModalNewMnemonicStory />
      </Layout>
      {/* TODO: Illustation empty state */}
    </>
  ))
  .add('2.1 – Accounts', () => (
    <>
      <Layout>
        <Header className='inline-flex mr3 mb0'>Your Accounts </Header>
        <ModalNewMnemonicStory />
      </Layout>
      <TableAccountsStory />
    </>
  ));

storiesOf('Apps/Lichen/3 - Add Account', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withAppMenuAccounts)
  .add('3.1.1.1 – New Mnemonic', () => <ModalNewMnemonicStory />)
  .add('3.1.1.2 – Rewrite Mnemonic', () => <ModalRewriteMnemonicStory />)
  .add('3.1.2.1 – with JSON', () => <ModalEnterJsonStory />)
  .add('3.1.3.1 – with Mnemonic', () => <ModalEnterMnemonicStory />)
  // TODO
  //.add('3.1.3.1 – with Signer', () => <></>)
  .add('3.2 – password and tags', () => <></>);

storiesOf('Apps/Lichen/4 – Send Funds', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .addDecorator(withAppMenuSend)
  .add('4.1 – Form (Empty)', () => (
    <>
      <Layout className='items-start'>
        <div className='w-100'>
          <Header className='mb2'>Send Funds</Header>
          <InputTransferFundsStory />
        </div>
        <div className='w-60 pl5'>{/* TODO: Illustation empty state */}</div>
      </Layout>
    </>
  ))
  .add('4.2 – Form (Filled)', () => (
    <>
      <Layout className='items-start'>
        <div className='w-100'>
          <Header className='mb2'>Send Funds</Header>
          <InputTransferFundsStory />
        </div>
        <div className='w-60-l pl5-l'>
          <div className='dn-m'>
            <TableTxSummaryStory />
          </div>
          <NavButton>Submit Transaction</NavButton>
        </div>
      </Layout>
    </>
  ));
