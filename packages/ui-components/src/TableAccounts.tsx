// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Table as SUITable,
  TableProps as SUITableProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

interface TableProps extends SUITableProps {
  wrapClass?: string;
}

const StyledTable = styled<typeof SUITable>(SUITable)`
  &&& {
    background-color: #ffffff;
    border-radius: 2px;
  }
  &&& thead th {
    border-left: none;
    border-right: none;
    font-weight: 500;
    &:nth-child(3), &:nth-last-child(2) {
      border-left: 1px solid;
    }
  }
  &&& tr td {
    &:nth-child(3), &:nth-last-child(2) {
      border-left: 1px solid;
    }
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
        opacity: 0.4;
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
    tr {
      border-bottom: none;
    }
    tr td {
      border-top: none;
      font-weight: 300;
    }
  }
`;

export function TableAccounts(props: TableProps): React.ReactElement {
  const {
    striped = true,
    selectable = true,
    basic = true,
    unstackable = true,
    wrapClass = 'ph6 pv3',
    ...rest
  } = props;
  return (
    <div className={wrapClass}>
      <StyledTable
        unstackable={unstackable}
        basic={basic}
        striped={striped}
        selectable={selectable}
        {...rest}
      />
    </div>
  );
}

TableAccounts.Header = SUITable.Header;
TableAccounts.HeaderCell = SUITable.HeaderCell;
TableAccounts.Body = SUITable.Body;
TableAccounts.Row = SUITable.Row;
TableAccounts.Cell = SUITable.Cell;
