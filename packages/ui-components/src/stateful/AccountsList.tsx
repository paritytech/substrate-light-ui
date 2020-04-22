// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';
import { CardProps } from 'semantic-ui-react/dist/commonjs/views/Card';

import { Card } from '../Card';
import { Paragraph } from '../Paragraph';
import { AddressSummary } from './AddressSummary';

type Props = {
  accounts?: InjectedAccountWithMeta[];
  api: ApiRx;
  onSelectAccount?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: CardProps
  ) => void;
};

function renderEmpty(): React.ReactElement {
  return <Paragraph faded>Hmmm...nothing to see here.</Paragraph>;
}

export function AccountsList(props: Props): React.ReactElement {
  const { accounts, api, onSelectAccount } = props;

  const renderAccountsListItem = (): React.ReactElement => {
    return (
      <List>
        {accounts &&
          accounts.map((account: InjectedAccountWithMeta) => {
            const {
              address,
              meta: { name },
            } = account;

            return (
              <List.Content key={address}>
                <Card height='100%' onClick={onSelectAccount}>
                  <Card.Content>
                    <AddressSummary
                      address={address}
                      api={api}
                      orientation='horizontal'
                      size='small'
                      name={name}
                      withShortAddress
                    />
                  </Card.Content>
                </Card>
              </List.Content>
            );
          })}
      </List>
    );
  };

  return <>{accounts ? renderAccountsListItem() : renderEmpty()}</>;
}
