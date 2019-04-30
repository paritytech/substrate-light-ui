import { useContext } from 'react';
import { AlertsContext } from '@substrate/ui-common';

// Alert helpers
export const notifyError = (value: any) => {
  const { enqueue } = useContext(AlertsContext);

  enqueue({
    content: value,
    type: 'success'
  });
};

export const notifySuccess = (value: any) => {
  const { enqueue } = useContext(AlertsContext);

  enqueue({
    content: value,
    type: 'error'
  });
};
