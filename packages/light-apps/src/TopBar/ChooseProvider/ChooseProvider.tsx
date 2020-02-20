import { Dropdown } from '@substrate/ui-components';
import React from 'react';

const options = [
  {
    key: 'kusamaCc3',
    text: 'Kusama CC3 (from extension Light Client)',
    value: JSON.stringify({
      payload: 'kusamaCc3',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'westend',
    text: 'Westend (from extension Light Client)',
    value: JSON.stringify({
      payload: 'westend',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'Kusama',
    text: 'Westend (from extension Light Client)',
    value: JSON.stringify({
      payload: 'kusamaCc3',
      type: 'WsProvider',
    }),
  },
];
export function ChooseProvider(): React.ReactElement {
  return <Dropdown options={options} placeholder='Select Network'></Dropdown>;
}
