// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIMenu, {
  MenuProps as SUIMenuProps,
} from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu';
import SUIDivider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

interface MenuProps extends SUIMenuProps {
  tabs: boolean;
}

const StyleTab = {
  menu: `
    border: none;
    margin-bottom: 0;
    box-shadow: inset 0 -12px 12px -10px rgba(0, 0, 0, 0.25);
  `,
  item: `
    // TODO: height
    height: 48px;
    &.active {
      background: ${polkadotOfficialTheme.black};
      color: ${polkadotOfficialTheme.white};
      &:hover {
        background: ${polkadotOfficialTheme.black};
      }
    }
    &:hover {
      background: ${polkadotOfficialTheme.white};
      cursor: pointer;
    }
  `,
}

const StyledMenu = styled<typeof SUIMenu>(SUIMenu)`
  &&& {
    ${props => (props.tabs ? StyleTab.menu : '')};
    .item {
      ${props => (props.tabs ? StyleTab.item : '')};
    }
  }
  box-shadow: 0 0 0 ${polkadotOfficialTheme.white};
`;

export function Menu(props: MenuProps): React.ReactElement {
  return <StyledMenu {...props} />;
}

Menu.Divider = SUIDivider;
Menu.Item = SUIMenu.Item;
