// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

// import { Create } from './Create';

const accountManagementOptions = [
  {
    key: 'Edit',
    text: 'Edit',
    value: 'Edit'
  },
  {
    key: 'Create',
    text: 'Create',
    value: 'Create'
  },
  {
    key: 'Restore',
    text: 'Restore',
    value: 'Restore'
  }
];

export class ManageAccounts extends React.PureComponent {
  render () {
    return (
      <Dropdown
          placeholder='Manage Accounts'
          fluid
          selection
          options={accountManagementOptions}
        />
    );
  }
}
