// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button } from 'semantic-ui-react';

import { TableAccounts } from './TableAccounts';
import { TableCellAddress } from './TableCellAddress';

interface HeaderProps {
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
  onSend?: any;
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
      <TableAccounts.Cell collapsing>
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

export function RowHeader(props: HeaderProps): React.ReactElement {
  const { isExpanded = false } = props;
  return (
    <TableAccounts.Header>
      <TableAccounts.Row>
        <TableAccounts.HeaderCell />
        <TableAccounts.HeaderCell>Funds</TableAccounts.HeaderCell>
        <TableAccounts.HeaderCell>Transferable</TableAccounts.HeaderCell>
        {isExpanded && (
          <>
            <TableAccounts.HeaderCell>Locked</TableAccounts.HeaderCell>
            <TableAccounts.HeaderCell>Reserved</TableAccounts.HeaderCell>
            <TableAccounts.HeaderCell>Bonded</TableAccounts.HeaderCell>
          </>
        )}
        <TableAccounts.HeaderCell>TX</TableAccounts.HeaderCell>
        <TableAccounts.HeaderCell />
      </TableAccounts.Row>
    </TableAccounts.Header>
  );
}
