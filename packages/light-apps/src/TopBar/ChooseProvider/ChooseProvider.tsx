import { Dropdown, DropdownProps } from '@substrate/ui-components';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { ProviderContext } from '../../ContextGate/context';

const options = [
  {
    key: 'PostMessageProvider|kusamaCc3',
    text: 'Kusama CC3 (from extension Light Client)',
    value: JSON.stringify({
      payload: 'kusamaCc3',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'PostMessageProvider|westend',
    text: 'Westend (from extension Light Client)',
    value: JSON.stringify({
      payload: 'westend',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'WsProvider|kusamaCc3',
    text: 'Kusama CC3 (from centralized remote node)',
    value: JSON.stringify({
      payload: 'wss://kusama-rpc.polkadot.io',
      type: 'WsProvider',
    }),
  },
];

const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

export function ChooseProvider(): React.ReactElement {
  const { providerJSON, setProviderJSON } = useContext(ProviderContext);

  return (
    <TopDropdown
      onChange={(_event: any, { value }: any): void => {
        console.log(value);
        setProviderJSON(JSON.parse(value as string));
      }}
      options={options}
      placeholder='Select Network'
      value={JSON.stringify(providerJSON)}
    />
  );
}
