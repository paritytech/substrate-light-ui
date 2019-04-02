// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { ErrorText } from '@substrate/ui-components';

import { Create } from './Create';
import { IdentityManagementScreen } from './types';

type Props = {
  screen: IdentityManagementScreen
};

export class ManageAccounts extends React.PureComponent<Props> {
  render () {
    const { screen } = this.props;

    switch (screen) {
      case 'Edit':
        return this.renderEditScreen();
        break;
      case 'Create':
        return this.renderCreateScreen();
        break;
      case 'Restore':
        return this.renderRestoreScreen();
        break;
      default:
        return this.renderError();
        break;
    }
  }

  renderCreateScreen () {
    return (
      <Create />
    );
  }

  renderEditScreen () {
    return (
      <p> Edit screen goes here </p>
    );
  }

  renderError () {
    return (
      <ErrorText> Screen doesn't exist </ErrorText>
    );
  }

  renderRestoreScreen () {
    return (
      <p> Restore screen goes here </p>
    );
  }
}
