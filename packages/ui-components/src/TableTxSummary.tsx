// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Table as SUITable,
  TableProps as SUITableProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

interface TableProps extends SUITableProps {
  wrapClass?: string;
}

// TODO: in shared?
const StyledTable = styled<typeof SUITable>(SUITable)`
  &&& {
    border: none;
    .signal {
      color: ${polkadotOfficialTheme.signal};
    }
  }
  &&& tr td {
    border: none;
    font-size: 1.2rem;
    font-weight: 600;
  }
  &&& tr:nth-child(3) td,
  &&& tr:nth-child(3) th {
    border-top: 1px solid lightgray;
  }
`;

export function TableTxSummary(props: TableProps): React.ReactElement {
  const {
    striped = false,
    selectable = false,
    basic = true,
    unstackable = true,
    wrapClass,
    ...rest
  } = props;
  return (
    <div className={wrapClass}>
      <StyledTable
        className='tableTxSummary'
        unstackable={unstackable}
        basic={basic}
        striped={striped}
        selectable={selectable}
        {...rest}
      />
    </div>
  );
}

TableTxSummary.Header = SUITable.Header;
TableTxSummary.HeaderCell = SUITable.HeaderCell;
TableTxSummary.Body = SUITable.Body;
TableTxSummary.Row = SUITable.Row;
TableTxSummary.Cell = SUITable.Cell;
