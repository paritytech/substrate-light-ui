// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIDropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

export { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

type SUIDropdown = typeof SUIDropdown;

// FIXME: customize as needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Dropdown: SUIDropdown = styled<any>(SUIDropdown)`
  color: ${polkadotOfficialTheme.black};
` as any; // eslint-disable-line @typescript-eslint/no-explicit-any

Dropdown.Divider = SUIDropdown.Divider;
Dropdown.Header = SUIDropdown.Header;
Dropdown.Item = SUIDropdown.Item;
Dropdown.Menu = SUIDropdown.Menu;
