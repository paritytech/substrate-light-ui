// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button } from 'semantic-ui-react';

import { TableAccounts } from '../src/TableAccounts';
import { TableCellAddress } from '../src/TableCellAddress';

type RowProps = {
  isExpanded?: boolean;
};

export function TableRowAccount(props: RowProps): React.ReactElement {
  const { isExpanded = false } = props;
  return (
    <TableAccounts.Row className='lurk-child'>
      <TableAccounts.Cell collapsing>
        <TableCellAddress
          address='GSveuiyCpFG1maA4SrSBPjdc4F6Rz9VjRCep2bqjnute7Aw'
          publicKey=''
          accountName='Name'
          shortAddress='shrtAddrs'
        />
      </TableAccounts.Cell>
      <TableAccounts.Cell>XXX</TableAccounts.Cell>
      <TableAccounts.Cell>xxx</TableAccounts.Cell>
      {isExpanded ? (
        <TableAccounts.Cell>Expanded</TableAccounts.Cell>
      ) : (
        <TableAccounts.Cell />
      )}
      <TableAccounts.Cell>7</TableAccounts.Cell>
      <TableAccounts.Cell>
        <Button.Group size='mini' className='child'>
          <Button>Send</Button>
          <Button>Import</Button>
          <Button>Forget</Button>
        </Button.Group>
      </TableAccounts.Cell>
    </TableAccounts.Row>
  );
}

export function TableRowAccountHeader(props: RowProps): React.ReactElement {
  const { isExpanded = false } = props;
  return (
    <TableAccounts.Header>
      <TableAccounts.Row>
        <TableAccounts.HeaderCell className='code f6' />
        <TableAccounts.HeaderCell className='code f6'>
          Funds
        </TableAccounts.HeaderCell>
        <TableAccounts.HeaderCell className='code f6'>
          Transferable
        </TableAccounts.HeaderCell>
        {isExpanded ? (
          <TableAccounts.Cell>Expanded</TableAccounts.Cell>
        ) : (
          <TableAccounts.Cell>...</TableAccounts.Cell>
        )}
        <TableAccounts.HeaderCell className='code f6'>
          TX
        </TableAccounts.HeaderCell>
        <TableAccounts.HeaderCell className='code f6' />
      </TableAccounts.Row>
    </TableAccounts.Header>
  );
}
