// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Table as SUITable,
  TabProps as SUITableProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

type TableProps = SUITableProps;

const StyledTable = styled<typeof SUITable>(SUITable)`
  &&& {
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  }
`;

export function TableAccounts(props: TableProps): React.ReactElement {
  return <StyledTable {...props} />;
}

TableAccounts.Header = SUITable.Header;
TableAccounts.HeaderCell = SUITable.HeaderCell;
TableAccounts.Body = SUITable.Body;
TableAccounts.Row = SUITable.Row;
TableAccounts.Cell = SUITable.Cell;
