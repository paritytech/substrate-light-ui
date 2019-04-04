// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Alert } from '@substrate/ui-components';
import React from 'react';

export class Alerts extends React.PureComponent {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render () {
    const { alertStore } = this.context;

    if (!alertStore.alerts) {
      return null;
    }

    return (
      <React.Fragment>
        {alertStore.alerts.map((alert) => (
          <Alert
            error={alert.type === 'error'}
            info={alert.type === 'info'}
            success={alert.type === 'success'}
            warning={alert.type === 'warning'}
          >
            {alert.content}
          </Alert>
        ))}
      </React.Fragment>
    );
  }
}
