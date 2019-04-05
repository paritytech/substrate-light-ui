// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ErrorText } from '@substrate/ui-components';

import { SaveAddress } from './SaveAddress';
import { IdentityManagementScreen, MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
  screen: IdentityManagementScreen;
}

export class ManageAddresses extends React.PureComponent<Props> {
  render () {
    const { screen } = this.props;

    switch (screen) {
      case 'Add':
        return this.renderSaveAddressScreen();
        break;
      default:
        return this.renderError();
        break;
    }
  }

  renderSaveAddressScreen () {
    return (
      <SaveAddress {...this.props} />
    );
  }

  renderError () {
    return (
      <ErrorText> Screen doesn't exist </ErrorText>
    );
  }
}
