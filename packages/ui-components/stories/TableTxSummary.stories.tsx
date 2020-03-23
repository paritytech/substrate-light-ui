// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { TableCellAddress } from '../src/TableCellAddress';
import { TableTxSummary } from '../src/TableTxSummary';
import { withTheme } from './customDecorators';

export const TableTxSummaryStory = () => {
  const wrapClass = text('wrapClass', '');
  const fromProps = object('fromAccount', {
    address: 'GSveuiyCpFG1maA4SrSBPjdc4F6Rz9VjRCep2bqjnute7Aw',
    accountName: 'Account Name',
    shortAddress: 'shrtAddrs2',
  });
  const toProps = object('toAccount', {
    address: 'DGRpKycTNWHdJEScAB6NymW28gAH3MWez94x5a8uGJgQ3So',
    accountName: 'Main Stash',
    shortAddress: 'shrtAddrs2',
  });
  return (
    <TableTxSummary wrapClass={wrapClass}>
      <TableTxSummary.Body>
        <TableTxSummary.Row>
          <TableTxSummary.HeaderCell className='signal'>
            From
          </TableTxSummary.HeaderCell>
          <TableTxSummary.Cell>
            <TableCellAddress {...fromProps} />
          </TableTxSummary.Cell>
        </TableTxSummary.Row>
        <TableTxSummary.Row>
          <TableTxSummary.HeaderCell className='signal'>
            To
          </TableTxSummary.HeaderCell>
          <TableTxSummary.Cell>
            <TableCellAddress {...toProps} />
          </TableTxSummary.Cell>
        </TableTxSummary.Row>
        <TableTxSummary.Row>
          <TableTxSummary.HeaderCell>Ammount</TableTxSummary.HeaderCell>
          <TableTxSummary.Cell>298371</TableTxSummary.Cell>
          <TableTxSummary.Cell className='signal currency' rowspan='3'>
            KSM
          </TableTxSummary.Cell>
        </TableTxSummary.Row>
        <TableTxSummary.Row>
          <TableTxSummary.HeaderCell>Tip</TableTxSummary.HeaderCell>
          <TableTxSummary.Cell>1</TableTxSummary.Cell>
        </TableTxSummary.Row>
        <TableTxSummary.Row>
          <TableTxSummary.HeaderCell className='signal'>
            Total
          </TableTxSummary.HeaderCell>
          <TableTxSummary.Cell className='signal'>298372</TableTxSummary.Cell>
        </TableTxSummary.Row>
      </TableTxSummary.Body>
    </TableTxSummary>
  );
};

storiesOf('TableTxSummary', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('TableTxSummary', () => <TableTxSummaryStory />);
