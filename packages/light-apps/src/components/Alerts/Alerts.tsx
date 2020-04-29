// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Alert as AlertType, AlertsContext } from '@substrate/context';
import { Alert, Layout } from '@substrate/ui-components';
import React, { useContext } from 'react';

export function Alerts(): React.ReactElement {
  const { alerts, remove } = useContext(AlertsContext);

  return (
    <Layout alert>
      {alerts.map((alert: AlertType) => (
        <Alert
          alertType={alert.type}
          key={alert.id}
          onDismiss={(): void => remove(alert.id)}
        >
          {alert.content}
        </Alert>
      ))}
    </Layout>
  );
}
