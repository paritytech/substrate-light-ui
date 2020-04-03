// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Modal } from '@substrate/ui-components';
import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { AddAccount } from './Add';
import { AccountsOverview } from './Overview';

type Props = RouteComponentProps;

export function Accounts(props: Props): React.ReactElement {
  const { history } = props;

  return (
    <>
      <Route
        path='/accounts/add'
        render={(routeProps): React.ReactElement => (
          <Modal open onClose={(): void => history.push('/')}>
            <AddAccount {...routeProps} />
          </Modal>
        )}
      />
      <Route component={AccountsOverview} />
    </>
  );
}
