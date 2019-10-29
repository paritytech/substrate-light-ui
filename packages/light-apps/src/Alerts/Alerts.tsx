// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Alert } from '@substrate/ui-components';
import { Alert as AlertType, AlertsContext } from '@substrate/ui-common';
import React, { useContext } from 'react';

export function Alerts (): React.ReactElement {
  const { alerts, remove } = useContext(AlertsContext);

  return (
    <React.Fragment>
      {alerts.map((alert: AlertType) => (
        <Alert
          error={alert.type === 'error'}
          info={alert.type === 'info'}
          key={alert.id}
          onDismiss={(): void => remove(alert.id)}
          success={alert.type === 'success'}
          warning={alert.type === 'warning'}
        >
          {alert.content}
        </Alert>
      ))}
    </React.Fragment>
  );
}
