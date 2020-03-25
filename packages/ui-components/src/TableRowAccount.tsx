// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button, TableHeaderProps } from 'semantic-ui-react';

import { TableAccounts } from './TableAccounts';
import { TableCellAddress } from './TableCellAddress';

interface HeaderProps extends TableHeaderProps {
  isExpanded?: boolean;
}
interface RowProps extends HeaderProps {
  name?: string;
  address?: string;
  shortAddress?: string;
  fundsTotal?: string;
  fundsTransferable?: string;
  fundsLocked?: string;
  fundsReserved?: string;
  fundsBonded?: string;
  nTx?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSend?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onForget?: any;
}

export function RowAccount(props: RowProps): React.ReactElement {
  const {
    isExpanded = false,
    name = 'Name',
    address = 'address',
    shortAddress = 'shrtAddrss',
    fundsTotal = '0',
    fundsTransferable = '0',
    fundsLocked = '0',
    fundsReserved = '0',
    fundsBonded = '0',
    nTx,
    onSend,
    onForget,
  } = props;
  return (
    <TableAccounts.Row>
      <TableAccounts.Cell>
        <TableCellAddress
          address={address}
          accountName={name}
          shortAddress={shortAddress}
        />
      </TableAccounts.Cell>
      <TableAccounts.Cell>{fundsTotal}</TableAccounts.Cell>
      <TableAccounts.Cell>{fundsTransferable}</TableAccounts.Cell>
      {isExpanded && (
        <>
          <TableAccounts.Cell>{fundsLocked}</TableAccounts.Cell>
          <TableAccounts.Cell>{fundsReserved}</TableAccounts.Cell>
          <TableAccounts.Cell>{fundsBonded}</TableAccounts.Cell>
        </>
      )}
      <TableAccounts.Cell className='bl1 b--red'>{nTx}</TableAccounts.Cell>
      <TableAccounts.Cell>
        <Button.Group fluid size='mini' basic>
          <Button onClick={onSend}>Send</Button>
          <Button onClick={onForget}>Forget</Button>
        </Button.Group>
      </TableAccounts.Cell>
    </TableAccounts.Row>
  );
}
export function RowAccountsTotal(props: RowProps): React.ReactElement {
  const {
    isExpanded = false,
    fundsTotal = '0',
    fundsTransferable = '0',
    fundsLocked = '0',
    fundsReserved = '0',
    fundsBonded = '0',
    nTx = '0',
  } = props;
  return (
    <TableAccounts.Row className='rowTotal'>
      <TableAccounts.Cell>
        <TableCellAddress accountName={<span className='f3 fw6'>Total</span>} />
      </TableAccounts.Cell>
      <TableAccounts.Cell>{fundsTotal}</TableAccounts.Cell>
      <TableAccounts.Cell>{fundsTransferable}</TableAccounts.Cell>
      {isExpanded && (
        <>
          <TableAccounts.Cell>{fundsLocked}</TableAccounts.Cell>
          <TableAccounts.Cell>{fundsReserved}</TableAccounts.Cell>
          <TableAccounts.Cell>{fundsBonded}</TableAccounts.Cell>
        </>
      )}
      <TableAccounts.Cell className='bl1 b--red'>{nTx}</TableAccounts.Cell>
      <TableAccounts.Cell />
    </TableAccounts.Row>
  );
}
