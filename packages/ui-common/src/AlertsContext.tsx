// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState, createContext } from 'react';

export type AlertType = 'error' | 'info' | 'success' | 'warning';

export interface AlertWithoutId {
  content: React.ReactNode;
  type: AlertType;
}

export interface Alert extends AlertWithoutId {
  id: number;
}

export const AlertsContext = createContext({
  enqueue: (newAlertWithoutId: AlertWithoutId) => { console.error('No context provider found above in the tree.'); },
  remove: (Alertid: number) => { console.error('No context provider found above in the tree.'); },
  alerts: [] as Alert[] });

interface Props {
  children: any;
}

export function AlertsContextProvider (props: Props) {

  const [{ alerts, nextAlertId }, setAlerts] = useState({ alerts: [] as Alert[], nextAlertId: 0 });

  const enqueue = (newAlertWithoutId: AlertWithoutId) => {
    setAlerts({
      alerts: [...alerts, { ...newAlertWithoutId, id: nextAlertId }],
      nextAlertId: nextAlertId + 1
    });
  };

  const remove = (alertId: number) => {
    setAlerts({
      alerts: [...alerts.filter(({ id }: {id: number}) => id !== alertId)],
      nextAlertId
    });
  };

  return <AlertsContext.Provider value={{ enqueue, remove, alerts }}>
    {props.children}
  </AlertsContext.Provider>;
}
