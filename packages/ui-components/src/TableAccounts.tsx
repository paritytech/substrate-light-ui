// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Table as SUITable,
  TableProps as SUITableProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

type TableProps = SUITableProps;

const StyledTable = styled<typeof SUITable>(SUITable)`
  &&& {
    background-color: #ffffff;
    border-radius: 2px;
  }
  &&& thead th {
    border-left: none;
    border-right: none;
  }
  &&&.striped {
    border: none;
    &.selectable {
      tbody tr {
        transition: box-shadow 0.2s;
      }
      tbody tr:hover {
        box-shadow: 0 -8px 12px rgba(210, 210, 210, 0.6);
      }
      tbody tr:hover {
        box-shadow: 0 -8px 12px rgba(210, 210, 210, 0.6);
      }
      tbody tr td:last-child {
        opacity: 0.5;
        transition: opacity 0.2s;
      }
      tbody tr:hover td {
        opacity: 1;
      }
    }
    thead th {
      border-bottom: none;
    }
    tbody tr:nth-child(2n) {
      background-color: white !important;
    }
    tbody tr:nth-child(2n-1) {
      background-color: #f4f4f4 !important;
    }
    tr td {
      border-top: none;
    }
    tr {
      border-bottom: none;
    }
  }
`;

export function TableAccounts(props: TableProps): React.ReactElement {
  const { striped = true, selectable = true, sortable = true } = props;
  return (
    <StyledTable
      striped={striped}
      selectable={selectable}
      sortable={sortable}
      {...props}
    />
  );
}

TableAccounts.Header = SUITable.Header;
TableAccounts.HeaderCell = SUITable.HeaderCell;
TableAccounts.Body = SUITable.Body;
TableAccounts.Row = SUITable.Row;
TableAccounts.Cell = SUITable.Cell;
