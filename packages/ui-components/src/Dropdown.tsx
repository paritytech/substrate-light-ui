// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Dropdown as SUIDropdown,
  DropdownProps as SUIDropdownProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

export interface DropdownProps extends SUIDropdownProps {
  theme?: string;
}

const DropdownDark = styled(SUIDropdown)`
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &&&.dropdown.item .menu {
    background-color: #1e1e1e;
    border-color: black;
    border-top: transparent;
    margin-top: 1px;

    > .item {
      color: white !important;
      font-weight: 300 !important;

      &.selected {
        font-weight: 900 !important;
      }
      &:hover {
        background: rgb(61, 62, 63) !important;
      }
    }
  }
`;

export function Dropdown(props: DropdownProps): React.ReactElement {
  const { theme = 'dark', ...rest } = props;
  return theme === 'dark' ? <DropdownDark {...rest} /> : <Dropdown {...rest} />;
}
