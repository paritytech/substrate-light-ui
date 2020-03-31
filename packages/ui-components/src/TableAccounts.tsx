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
    background-color: #ffffff;
    border-radius: 2px;
  }
  &&& thead th {
    border-left: none;
    border-right: none;
    font-weight: 500;
    &:nth-child(3),
    &:nth-last-child(2) {
      border-left: 1px solid ${polkadotOfficialTheme.grey};
    }
  }
  &&& tr td {
    &:nth-child(3),
    &:nth-last-child(2) {
      border-left: 1px solid ${polkadotOfficialTheme.grey};
    }
  }
  &&& .rowTotal {
    background-color: transparent !important;
    &:hover {
      background: transparent !important;
    }
    td {
      &:not(:last-child) {
        border-top: 2px solid black;
        border-bottom: 2px solid black;
      }
      &:first-child {
        border-left: 2px solid black;
        border-radius: 4px 0 0 4px;
      }
      &:nth-last-child(2) {
        border-right: 2px solid black;
        border-radius: 0 4px 4px 0;
      }
    }
    [class^='Identicon'] {
      opacity: 0;
    }
  }
  &&&.striped {
    border: none;
    &.selectable {
      tbody tr {
        transition: box-shadow 0.2s;
      }
      tbody tr:not(.rowTotal):hover {
        box-shadow: 0 -8px 12px ${polkadotOfficialTheme.shadow};
      }
      tbody tr td:last-child {
        opacity: 0.4;
        transition: opacity 0.2s;
      }
      tbody tr:hover td {
        opacity: 1;
        .ui.basic.buttons .button:hover {
          color: ${polkadotOfficialTheme.signal} !important;
        }
      }
    }
    thead th {
      border-bottom: none;
    }
    tbody tr:nth-child(2n) {
      background-color: white !important;
    }
    tbody tr:not(.rowTotal):nth-child(2n-1) {
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
    wrapClass,
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
